// --- تنظیمات قابل ویرایش ---
const CONFIG = {
  defaults: {
    course: 'photoshop',
    term: 36
  },
  links: {
    panel: 'https://panel.rayan.academy',
    apollonHub: 'https://zil.ink/apollon',
    channel: 'https://t.me/Apollon_Neda',         // جایگزین کن
    rules: 'https://zil.ink/apollon#rules',        // جایگزین کن
    zeroVideo: 'https://zil.ink/apollon#zero',     // جایگزین کن
    widemGuide: 'https://zil.ink/apollon#widem',   // جایگزین کن
    liveHowTo: 'https://zil.ink/apollon#live',     // جایگزین کن
    support: 'https://t.me/Apollon_Yar',           // جایگزین کن
    assignmentsForm: 'https://docs.google.com/forms/d/EXAMPLE',   // جایگزین کن
    gradesSheet: 'https://docs.google.com/spreadsheets/d/EXAMPLE',// جایگزین کن
    meetLink: 'https://meet.google.com/EXAMPLE'    // جایگزین کن
  }
};

// --- کمک‌تابع‌ها ---
const tg = window.Telegram?.WebApp;
const isInTelegram = !!tg;

function openLink(url, tryInstant = true) {
  if (isInTelegram && tryInstant) return tg.openLink(url, { try_instant_view: true });
  window.open(url, '_blank', 'noopener');
}

function haptic(type = 'light') {
  try { tg?.HapticFeedback?.impactOccurred(type); } catch {}
}

function save(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function load(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}

function applyThemeFromTelegram() {
  if (!isInTelegram) return;
  const p = tg.themeParams || {};
  // نگاشت چند متغیر مهم تلگرام به CSS Variables
  const root = document.documentElement;
  if (p.bg_color) root.style.setProperty('--bg', p.bg_color);
  if (p.secondary_bg_color) root.style.setProperty('--surface', p.secondary_bg_color);
  if (p.text_color) root.style.setProperty('--on-bg', p.text_color);
  if (p.hint_color) root.style.setProperty('--muted', p.hint_color);
  if (p.section_separator_color) root.style.setProperty('--stroke', p.section_separator_color);
  document.body.classList.remove('light');
  document.body.classList.add(tg.colorScheme === 'light' ? 'tg-light' : 'tg-dark');
}

function setMainButton(sectionId) {
  if (!isInTelegram) return;
  if (sectionId === 'assignments') {
    tg.MainButton.setText('ارسال تکلیف');
    tg.MainButton.show();
    tg.MainButton.onClick(() => openLink(CONFIG.links.assignmentsForm));
  } else {
    tg.MainButton.hide();
    tg.MainButton.offClick(() => {});
  }
}

function setBackButton(sectionId) {
  if (!isInTelegram) return;
  if (sectionId !== 'home') tg.BackButton.show();
  else tg.BackButton.hide();
}

// --- راه‌اندازی ---
document.addEventListener('DOMContentLoaded', () => {
  // مقداردهی اولیه تلگرام
  if (isInTelegram) {
    tg.expand();
    applyThemeFromTelegram();
  }

  // عناصر
  const tabs = [...document.querySelectorAll('.tab')];
  const views = [...document.querySelectorAll('.view')];
  const panelBtn = document.getElementById('panelBtn');
  const courseMeta = document.getElementById('courseMeta');
  const userFirstName = document.getElementById('userFirstName');
  const profileName = document.getElementById('profileName');
  const profileUsername = document.getElementById('profileUsername');
  const courseSelect = document.getElementById('courseSelect');
  const termInput = document.getElementById('termInput');
  const themeButtons = document.querySelectorAll('[data-theme]');
  const hapticTest = document.getElementById('hapticTest');
  const joinMeet = document.getElementById('joinMeet');
  const historyList = document.getElementById('historyList');

  // لینک کارت‌ها
  document.querySelectorAll('[data-link]').forEach(el => {
    el.addEventListener('click', () => {
      const key = el.getAttribute('data-link');
      const url = CONFIG.links[key];
      if (!url) return;
      haptic('light');
      openLink(url);
      // ثبت تاریخچه ارسال تکلیف
      if (key === 'assignmentsForm') {
        const now = new Date();
        const history = load('apollon_history', []);
        history.unshift({ type: 'assignment', at: now.toISOString() });
        save('apollon_history', history.slice(0, 20));
        renderHistory(historyList, history);
      }
    });
  });

  // دکمه پنل
  panelBtn.addEventListener('click', () => {
    haptic('light');
    openLink(CONFIG.links.panel);
  });

  // ناوبری تب‌ها
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-target');
      switchView(target);
    });
  });

  // دکمه برگشت تلگرام
  tg?.BackButton?.onClick(() => switchView('home'));

  // ورود به میت
  joinMeet.addEventListener('click', () => openLink(CONFIG.links.meetLink, false));

  // پروفایل از تلگرام
  const tgUser = tg?.initDataUnsafe?.user || null;
  const saved = load('apollon_profile', {
    course: CONFIG.defaults.course,
    term: CONFIG.defaults.term
  });

  // نام/یوزرنیم
  const firstName = tgUser?.first_name || 'هنرجو';
  userFirstName.textContent = firstName;
  profileName.textContent = `${tgUser?.first_name ?? '—'} ${tgUser?.last_name ?? ''}`.trim() || '—';
  profileUsername.textContent = tgUser?.username ? `@${tgUser.username}` : '—';

  // دوره/ترم
  courseSelect.value = saved.course;
  termInput.value = saved.term;
  updateCourseMeta();

  courseSelect.addEventListener('change', () => {
    saveProfile();
    updateCourseMeta();
  });
  termInput.addEventListener('input', () => {
    saveProfile();
    updateCourseMeta();
  });

  function saveProfile() {
    const data = {
      course: courseSelect.value,
      term: Number(termInput.value || CONFIG.defaults.term)
    };
    save('apollon_profile', data);
  }

  function updateCourseMeta() {
    const courseTitle = courseSelect.value === 'premiere' ? 'آپولون پریمیر' : 'آپولون فتوشاپ';
    const term = Number(termInput.value || CONFIG.defaults.term);
    courseMeta.textContent = `${courseTitle} — ترم ${term}`;
    document.title = `آپولون — ${courseTitle} ترم ${term}`;
  }

  // تاریخچه
  renderHistory(historyList, load('apollon_history', []));

  // تم دستی
  themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.getAttribute('data-theme');
      haptic('light');
      if (mode === 'system') {
        document.body.classList.remove('light');
        applyThemeFromTelegram();
        save('apollon_theme', 'system');
      } else if (mode === 'light') {
        document.body.classList.add('light');
        save('apollon_theme', 'light');
      } else {
        document.body.classList.remove('light');
        document.body.classList.add('tg-dark');
        save('apollon_theme', 'dark');
      }
    });
  });

  // بازیابی تم ذخیره‌شده
  const themePref = load('apollon_theme', 'system');
  if (themePref === 'light') document.body.classList.add('light');
  else if (themePref === 'dark') document.body.classList.add('tg-dark');

  // هپتیک تست
  hapticTest.addEventListener('click', () => haptic('medium'));

  // بازیابی تب از هَش
  const initial = location.hash?.replace('#', '') || 'home';
  switchView(initial);

  // همگام با تغییر هَش
  window.addEventListener('hashchange', () => {
    const target = location.hash?.replace('#', '') || 'home';
    switchView(target);
  });

  // کمک: رندر تاریخچه
  function renderHistory(container, items) {
    container.innerHTML = '';
    if (!items.length) {
      const li = document.createElement('li');
      li.textContent = 'هنوز سابقه‌ای ثبت نشده.';
      li.className = 'muted';
      container.appendChild(li);
      return;
    }
    items.slice(0, 10).forEach(it => {
      const li = document.createElement('li');
      const d = new Date(it.at);
      li.textContent = `ارسال تکلیف — ${d.toLocaleString('fa-IR', { dateStyle:'medium', timeStyle:'short' })}`;
      container.appendChild(li);
    });
  }

  // سوییچ ویو
  function switchView(id) {
    const target = views.find(v => v.id === id) ? id : 'home';
    views.forEach(v => v.classList.toggle('active', v.id === target));
    tabs.forEach(t => t.classList.toggle('active', t.getAttribute('data-target') === target));
    setMainButton(target);
    setBackButton(target);
    if (location.hash.replace('#', '') !== target) {
      history.replaceState(null, '', `#${target}`);
    }
    haptic('light');
  }
});
