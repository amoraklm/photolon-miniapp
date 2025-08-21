// حالت و ذخیره‌سازی
const state = {
  os: localStorage.getItem('ps_os') || 'win', // 'win' | 'mac'
  open: JSON.parse(localStorage.getItem('ps_open') || '[]') // آرایه id دسته‌های باز
};

// داده‌ها: دسته‌ها + آیتم‌ها
// پوشش پرکاربردترین شورتکات‌ها؛ می‌تونی موارد بیشتری اضافه کنی.
const CATS = [
  {
    id: 'general',
    title: 'عمومی',
    items: [
      i('New Document','ساخت سند جدید','Ctrl + N','Cmd + N'),
      i('Open','باز کردن فایل','Ctrl + O','Cmd + O'),
      i('Save','ذخیره','Ctrl + S','Cmd + S'),
      i('Save As','ذخیره با نام جدید','Ctrl + Shift + S','Cmd + Shift + S'),
      i('Close Document','بستن سند','Ctrl + W','Cmd + W'),
      i('Print','چاپ','Ctrl + P','Cmd + P'),
      i('Preferences','تنظیمات','Ctrl + K','Cmd + K'),
      i('Quit Photoshop','خروج','Alt + F4','Cmd + Q')
    ]
  },
  {
    id: 'edit',
    title: 'ویرایش',
    items: [
      i('Undo/Step Backward','یک مرحله عقب','Ctrl + Z / Alt + Ctrl + Z','Cmd + Z / Cmd + Opt + Z'),
      i('Redo/Step Forward','یک مرحله جلو','Shift + Ctrl + Z','Shift + Cmd + Z'),
      i('Cut','برش','Ctrl + X','Cmd + X'),
      i('Copy','کپی','Ctrl + C','Cmd + C'),
      i('Paste','چسباندن','Ctrl + V','Cmd + V'),
      i('Free Transform','تغییر اندازه/چرخش','Ctrl + T','Cmd + T'),
      i('Content-Aware Fill','پرکردن هوشمند','Shift + F5','Shift + F5'),
      i('Fill Foreground','پر کردن با رنگ پیش‌زمینه','Alt + Backspace','Opt + Delete')
    ]
  },
  {
    id: 'layers',
    title: 'لایه‌ها',
    items: [
      i('New Layer','لایه جدید','Ctrl + Shift + N','Cmd + Shift + N'),
      i('Duplicate Layer','کپی لایه','Ctrl + J','Cmd + J'),
      i('Merge Layers','ادغام لایه‌ها','Ctrl + E','Cmd + E'),
      i('Merge Visible','ادغام قابل‌مشاهده','Shift + Ctrl + E','Shift + Cmd + E'),
      i('Bring to Front','آوردن به جلو','Shift + Ctrl + ]','Shift + Cmd + ]'),
      i('Send to Back','فرستادن به عقب','Shift + Ctrl + [','Shift + Cmd + ['),
      i('New Group','گروه جدید','Ctrl + G','Cmd + G'),
      i('Clipping Mask','کلیپینگ ماسک','Alt + Ctrl + G','Opt + Cmd + G')
    ]
  },
  {
    id: 'selection',
    title: 'انتخاب',
    items: [
      i('Select All','انتخاب همه','Ctrl + A','Cmd + A'),
      i('Deselect','لغو انتخاب','Ctrl + D','Cmd + D'),
      i('Reselect','انتخاب مجدد','Shift + Ctrl + D','Shift + Cmd + D'),
      i('Inverse Selection','معکوس‌کردن انتخاب','Shift + Ctrl + I','Shift + Cmd + I'),
      i('Feather','نرم‌کردن لبه انتخاب','Shift + F6','Shift + F6'),
      i('Select Color Range','انتخاب بازه رنگ','Shift + Ctrl + F','Shift + Cmd + F'),
      i('Transform Selection','تبدیل ناحیه انتخاب','Shift + Ctrl + T','Shift + Cmd + T')
    ]
  },
  {
    id: 'tools',
    title: 'ابزارها',
    items: [
      i('Move Tool','جابجایی','V','V'),
      i('Marquee Tools','چهارگوش/بیضی','M','M'),
      i('Lasso Tools','لاسو','L','L'),
      i('Quick Selection / Magic Wand','انتخاب سریع/چوب جادویی','W','W'),
      i('Crop Tool','برش','C','C'),
      i('Eyedropper','نمونه‌بردار رنگ','I','I'),
      i('Brush Tool','براش','B','B'),
      i('Clone Stamp','کلون استمپ','S','S'),
      i('History Brush','هیستوری براش','Y','Y'),
      i('Eraser','پاک‌کن','E','E'),
      i('Gradient / Paint Bucket','گرادیان/سطل رنگ','G','G'),
      i('Dodge / Burn','روشن/تیره','O','O'),
      i('Pen Tool','قلم','P','P'),
      i('Type Tool','متن','T','T'),
      i('Path/Direct Selection','انتخاب مسیر/مستقیم','A','A'),
      i('Rectangle/Shape','اشکال','U','U'),
      i('Hand Tool (Hold)','دست (نگه‌داشتن Space)','Space','Space'),
      i('Zoom Tool','بزرگ‌نمایی ابزار','Z','Z')
    ]
  },
  {
    id: 'nav',
    title: 'نمایش و نویگیشن',
    items: [
      i('Zoom In','بزرگنمایی','Ctrl + = / Ctrl + +','Cmd + = / Cmd + +'),
      i('Zoom Out','کوچکنمایی','Ctrl -','Cmd -'),
      i('Fit on Screen','جای‌گیری در صفحه','Ctrl + 0','Cmd + 0'),
      i('Actual Pixels (100%)','نمایش ۱۰۰٪','Ctrl + 1','Cmd + 1'),
      i('Toggle Full Screen','تمام‌صفحه','F','F'),
      i('Toggle Screen Mode','حالت‌های نمایش','Shift + F','Shift + F'),
      i('Show/Hide Extras','نمایش اضافات (گرید/گاید...)','Ctrl + H','Cmd + H')
    ]
  },
  {
    id: 'type',
    title: 'متن',
    items: [
      i('Toggle Character/Paragraph','پنل متن','Ctrl + T','Cmd + T'),
      i('Increase Font Size','افزایش اندازه فونت','Ctrl + Shift + >','Cmd + Shift + >'),
      i('Decrease Font Size','کاهش اندازه فونت','Ctrl + Shift + <','Cmd + Shift + <'),
      i('Bold','بولد','Ctrl + Shift + B','Cmd + Shift + B'),
      i('Italic','ایتالیک','Ctrl + Shift + I','Cmd + Shift + I'),
      i('All Caps','حروف بزرگ','Ctrl + Shift + K','Cmd + Shift + K'),
      i('Baseline Shift Up','بالابردن بیس‌لاین','Alt + Shift + Up','Opt + Shift + Up'),
      i('Baseline Shift Down','پایین‌آوردن بیس‌لاین','Alt + Shift + Down','Opt + Shift + Down')
    ]
  },
  {
    id: 'color',
    title: 'رنگ و تنظیمات',
    items: [
      i('Foreground Color Picker','انتخاب رنگ پیش‌زمینه','Alt + Shift + Backspace','Opt + Shift + Delete'),
      i('Swap Foreground/Background','جابجایی رنگ‌ها','X','X'),
      i('Default Colors','بازگشت به سیاه/سفید','D','D'),
      i('Adjustments Panel','پنل ادجاستمنت','Ctrl + F9','Cmd + F9'),
      i('Levels','لولز','Ctrl + L','Cmd + L'),
      i('Curves','کرووز','Ctrl + M','Cmd + M'),
      i('Hue/Saturation','هیو/ستیوریشن','Ctrl + U','Cmd + U'),
      i('Color Balance','بالانس رنگ','Ctrl + B','Cmd + B')
    ]
  },
  {
    id: 'guides',
    title: 'راهنماها و خط‌کش',
    items: [
      i('Toggle Rulers','نمایش خط‌کش','Ctrl + R','Cmd + R'),
      i('Show/Hide Guides','نمایش راهنماها','Ctrl + ;','Cmd + ;'),
      i('Lock Guides','قفل راهنماها','Alt + Ctrl + ;','Opt + Cmd + ;'),
      i('Clear Guides','حذف همه راهنماها','Ctrl + Alt + ;','Cmd + Opt + ;'),
      i('Snap','چسبندگی','Shift + Ctrl + ;','Shift + Cmd + ;'),
      i('New Guide','راهنمای جدید','Ctrl + R then drag','Cmd + R سپس درگ')
    ]
  },
  {
    id: 'history',
    title: 'هیستوری و سایر',
    items: [
      i('History Panel','پنل هیستوری','F10','F10'),
      i('Layers Panel','پنل لایه‌ها','F7','F7'),
      i('Brush Panel','پنل براش','F5','F5'),
      i('Toggle Menus','نمایش/مخفی منو','Tab','Tab'),
      i('Quick Export (Export As)','پنجره Export As','Ctrl + Alt + Shift + W','Cmd + Opt + Shift + W'),
      i('Show Info','اطلاعات تصویر','F8','F8')
    ]
  },
  {
    id: 'file-export',
    title: 'فایل و خروجی',
    items: [
      i('Export Quick PNG','اِکسپورت سریع','Alt + Shift + Ctrl + W','Opt + Shift + Cmd + W'),
      i('Save for Web (Legacy)','ذخیره برای وب (قدیمی)','Ctrl + Alt + Shift + S','Cmd + Opt + Shift + S'),
      i('Place Embedded','جایگذاری داخلی','Shift + Ctrl + P','Shift + Cmd + P'),
      i('Place Linked','جایگذاری لینک‌شده','Alt + Shift + Ctrl + P','Opt + Shift + Cmd + P')
    ]
  }
];

// کمکی برای ساخت آیتم
function i(title, desc, win, mac){ return { title, desc, win, mac }; }

// عناصر DOM
const nav = document.getElementById('catNav');
const acc = document.getElementById('accordion');
const tplSection = document.getElementById('tpl-section');
const tplItem = document.getElementById('tpl-item');
const osToggle = document.getElementById('osToggle');
const btnExpandAll = document.getElementById('expandAll');
const btnCollapseAll = document.getElementById('collapseAll');

// راه‌اندازی
document.addEventListener('DOMContentLoaded', () => {
  // وضعیت اولیه سوییچ OS
  osToggle.checked = state.os === 'mac';

  // ساخت ناوبری دسته‌ها
  buildNav();

  // رندر آکاردئون
  renderAccordion();

  // رویدادها
  osToggle.addEventListener('change', () => {
    state.os = osToggle.checked ? 'mac' : 'win';
    localStorage.setItem('ps_os', state.os);
    updateAllKeys();
  });

  btnExpandAll.addEventListener('click', () => openCloseAll(true));
  btnCollapseAll.addEventListener('click', () => openCloseAll(false));
});

// ساخت چیپ‌های ناوبری
function buildNav(){
  CATS.forEach(c => {
    const b = document.createElement('button');
    b.className = 'chip';
    b.textContent = c.title;
    b.addEventListener('click', () => {
      document.getElementById(`sec-${c.id}`)?.scrollIntoView({ behavior:'smooth', block:'start' });
      // اگر بسته است، بازش کن
      const header = document.querySelector(`#sec-${c.id} .acc-header`);
      if (header?.getAttribute('aria-expanded') === 'false') toggleSection(header);
    });
    nav.appendChild(b);
  });
}

// رندر آکاردئون
function renderAccordion(){
  acc.innerHTML = '';
  CATS.forEach(cat => {
    const node = tplSection.content.firstElementChild.cloneNode(true);
    node.id = `sec-${cat.id}`;
    node.querySelector('h3').textContent = cat.title;
    node.querySelector('.count').textContent = `${cat.items.length} کلید`;
    const header = node.querySelector('.acc-header');
    const panel = node.querySelector('.acc-panel');
    const list = node.querySelector('.shortcut-list');

    // آیتم‌ها
    cat.items.forEach(item => {
      const li = tplItem.content.firstElementChild.cloneNode(true);
      li.querySelector('.s-title').textContent = item.title;
      li.querySelector('.desc').textContent = item.desc;
      li.querySelector('.kbd').textContent = state.os === 'mac' ? item.mac : item.win;
      list.appendChild(li);
    });

    // وضعیت باز/بسته از حافظه
    const shouldOpen = state.open.includes(cat.id);
    setPanelState(header, panel, shouldOpen, false);

    // تعامل با هدر
    header.addEventListener('click', () => toggleSection(header));

    acc.appendChild(node);
  });
}

// توگل یک سکشن
function toggleSection(header){
  const section = header.closest('.acc-section');
  const panel = section.querySelector('.acc-panel');
  const isOpen = header.getAttribute('aria-expanded') === 'true';
  setPanelState(header, panel, !isOpen, true);

  // ذخیره وضعیت
  const id = section.id.replace('sec-','');
  if (!isOpen) {
    if (!state.open.includes(id)) state.open.push(id);
  } else {
    state.open = state.open.filter(x => x !== id);
  }
  localStorage.setItem('ps_open', JSON.stringify(state.open));
}

// باز/بستن همه
function openCloseAll(open){
  document.querySelectorAll('.acc-section').forEach(sec => {
    const header = sec.querySelector('.acc-header');
    const panel = sec.querySelector('.acc-panel');
    setPanelState(header, panel, open, true);
    const id = sec.id.replace('sec-','');
    if (open && !state.open.includes(id)) state.open.push(id);
    if (!open) state.open = [];
  });
  localStorage.setItem('ps_open', JSON.stringify(state.open));
}

// اعمال حالت پنل با انیمیشن ارتفاع
function setPanelState(header, panel, open, animate){
  header.setAttribute('aria-expanded', open ? 'true' : 'false');
  panel.setAttribute('aria-hidden', open ? 'false' : 'true');

  if (!animate){
    panel.style.height = open ? 'auto' : '0px';
    return;
  }

  if (open){
    panel.style.height = 'auto';
    const target = panel.scrollHeight;
    panel.style.height = '0px';
    requestAnimationFrame(() => {
      panel.style.height = target + 'px';
      panel.addEventListener('transitionend', function done(){
        panel.style.height = 'auto';
        panel.removeEventListener('transitionend', done);
      });
    });
  } else {
    const from = panel.scrollHeight;
    panel.style.height = from + 'px';
    requestAnimationFrame(() => {
      panel.style.height = '0px';
    });
  }
}

// به‌روزرسانی کلیدها بر اساس OS
function updateAllKeys(){
  document.querySelectorAll('.acc-section').forEach((sec, idx) => {
    const cat = CATS[idx];
    const codes = sec.querySelectorAll('.kbd');
    codes.forEach((codeEl, i) => {
      codeEl.textContent = state.os === 'mac' ? cat.items[i].mac : cat.items[i].win;
    });
  });
}
