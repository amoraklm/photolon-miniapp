// داده نمونه شورتکات‌ها
const SHORTCUTS = [
  { id: 1, title: "Free Transform", cat: "tools", win: "Ctrl + T", mac: "Cmd + T", desc: "تغییر اندازه و چرخش آبجکت یا لایه." },
  { id: 2, title: "Duplicate Layer", cat: "layers", win: "Ctrl + J", mac: "Cmd + J", desc: "کپی گرفتن از لایه انتخاب‌شده." },
  { id: 3, title: "New Layer", cat: "layers", win: "Ctrl + Shift + N", mac: "Cmd + Shift + N", desc: "ساخت لایه جدید با تنظیمات." },
  { id: 4, title: "Merge Layers", cat: "layers", win: "Ctrl + E", mac: "Cmd + E", desc: "ادغام لایه‌های انتخابی." },
  { id: 5, title: "Select All", cat: "selection", win: "Ctrl + A", mac: "Cmd + A", desc: "انتخاب کل بوم." },
  { id: 6, title: "Deselect", cat: "selection", win: "Ctrl + D", mac: "Cmd + D", desc: "لغو انتخاب." },
  { id: 7, title: "Inverse Selection", cat: "selection", win: "Ctrl + Shift + I", mac: "Cmd + Shift + I", desc: "وارونه کردن محدوده انتخاب." },
  { id: 8, title: "Brush Tool", cat: "tools", win: "B", mac: "B", desc: "انتخاب ابزار براش." },
  { id: 9, title: "Move Tool", cat: "tools", win: "V", mac: "V", desc: "جابجایی آبجکت‌ها و لایه‌ها." },
  { id:10, title: "Zoom In", cat: "navigation", win: "Ctrl + +", mac: "Cmd + +", desc: "بزرگنمایی نمای بوم." },
  { id:11, title: "Zoom Out", cat: "navigation", win: "Ctrl + -", mac: "Cmd + -", desc: "کوچکنمایی نمای بوم." },
  { id:12, title: "Fit on Screen", cat: "navigation", win: "Ctrl + 0", mac: "Cmd + 0", desc: "نمایش کل تصویر در صفحه." },
  { id:13, title: "Hand Tool (Hold)", cat: "navigation", win: "Space", mac: "Space", desc: "پیمایش سریع با نگه‌داشتن Space." },
  { id:14, title: "Toggle Rulers", cat: "navigation", win: "Ctrl + R", mac: "Cmd + R", desc: "نمایش/عدم نمایش خط‌کش‌ها." },
  { id:15, title: "Quick Selection Tool", cat: "tools", win: "W", mac: "W", desc: "ابزار انتخاب سریع نواحی." },
  { id:16, title: "Crop Tool", cat: "tools", win: "C", mac: "C", desc: "ابزار برش تصویر." },
  { id:17, title: "New Document", cat: "general", win: "Ctrl + N", mac: "Cmd + N", desc: "ساخت سند جدید." },
  { id:18, title: "Save", cat: "general", win: "Ctrl + S", mac: "Cmd + S", desc: "ذخیره سند." },
  { id:19, title: "Save As", cat: "general", win: "Ctrl + Shift + S", mac: "Cmd + Shift + S", desc: "ذخیره با نام جدید." },
  { id:20, title: "Quick Export (Export As)", cat: "export", win: "Ctrl + Alt + Shift + W", mac: "Cmd + Opt + Shift + W", desc: "بازکردن پنجره Export As." },
  { id:21, title: "Type Tool", cat: "type", win: "T", mac: "T", desc: "ابزار تایپ متن." },
];

// حالت برنامه
const state = {
  q: "",
  cat: "all",
  os: "win",
  theme: "light",
};

// DOM
const resultsEl = document.getElementById("results");
const searchInput = document.getElementById("searchInput");
const clearSearch = document.getElementById("clearSearch");
const chips = document.querySelectorAll(".chip");
const osButtons = document.querySelectorAll(".os-toggle .seg");
const themeToggle = document.getElementById("themeToggle");
const template = document.getElementById("shortcut-card");
const metaTheme = document.getElementById("metaThemeColor");

// ابزارها
const persianNormalize = s =>
  s.toLowerCase()
   .replace(/[آأإ]/g, "ا")
   .replace(/ي/g, "ی")
   .replace(/ك/g, "ک")
   .replace(/[^\p{L}\p{N}\+\-\s]/gu, ""); // حذف علائم غیرضروری اما + و - را نگه می‌دارد

const escapeHTML = s => s.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

function highlight(text, terms) {
  if (!terms.length) return escapeHTML(text);
  let safe = escapeHTML(text);
  terms.forEach(t => {
    if (!t) return;
    const rx = new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    safe = safe.replace(rx, m => `<mark>${m}</mark>`);
  });
  return safe;
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("rayan_theme", theme);
  themeToggle.querySelector(".icon").textContent = theme === "dark" ? "☀️" : "🌙";
  metaTheme.setAttribute("content", theme === "dark" ? "#0f172a" : "#ffffff");
}

function initTheme() {
  const saved = localStorage.getItem("rayan_theme");
  if (saved) return applyTheme(saved);
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(prefersDark ? "dark" : "light");
}

// رندر
function render() {
  const q = persianNormalize(state.q);
  const terms = q.split(/\s+/).filter(Boolean);

  const filtered = SHORTCUTS.filter(it => {
    const catOk = state.cat === "all" || it.cat === state.cat;
    if (!catOk) return false;
    if (!terms.length) return true;

    const hay = persianNormalize(
      `${it.title} ${it.desc} ${it.win} ${it.mac} ${it.cat}`
    );
    return terms.every(t => hay.includes(t));
  });

  resultsEl.innerHTML = "";

  if (!filtered.length) {
    resultsEl.innerHTML = `<div class="card"><p>نتیجه‌ای پیدا نشد. عبارت دیگری امتحان کن.</p></div>`;
    return;
  }

  const frag = document.createDocumentFragment();

  filtered.forEach(it => {
    const node = template.content.firstElementChild.cloneNode(true);
    node.querySelector(".title").innerHTML = highlight(it.title, terms);
    node.querySelector(".badge").textContent = labelForCategory(it.cat);
    node.querySelector(".desc").innerHTML = highlight(it.desc, terms);

    const keyWin = node.querySelector(".keyline.win .kbd");
    const keyMac = node.querySelector(".keyline.mac .kbd");
    keyWin.innerHTML = highlight(it.win, terms);
    keyMac.innerHTML = highlight(it.mac, terms);

    // نمایش براساس OS
    node.querySelector(".keyline.win").style.display = state.os === "win" ? "flex" : "none";
    node.querySelector(".keyline.mac").style.display = state.os === "mac" ? "flex" : "none";

    frag.appendChild(node);
  });

  resultsEl.appendChild(frag);
}

function labelForCategory(cat) {
  switch (cat) {
    case "general": return "عمومی";
    case "layers": return "لایه‌ها";
    case "selection": return "انتخاب";
    case "tools": return "ابزارها";
    case "navigation": return "نویگیشن";
    case "type": return "متن";
    case "export": return "خروجی";
    default: return "دیگر";
  }
}

// رویدادها
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  render();

  searchInput.addEventListener("input", e => {
    state.q = e.target.value;
    clearSearch.classList.toggle("show", !!state.q);
    render();
  });

  clearSearch.addEventListener("click", () => {
    state.q = "";
    searchInput.value = "";
    clearSearch.classList.remove("show");
    searchInput.focus();
    render();
  });

  chips.forEach(btn => {
    btn.addEventListener("click", () => {
      chips.forEach(b => { b.classList.remove("active"); b.setAttribute("aria-selected", "false"); });
      btn.classList.add("active"); btn.setAttribute("aria-selected", "true");
      state.cat = btn.dataset.cat;
      render();
    });
  });

  osButtons.forEach(b => {
    b.addEventListener("click", () => {
      osButtons.forEach(x => { x.classList.remove("active"); x.setAttribute("aria-pressed", "false"); });
      b.classList.add("active"); b.setAttribute("aria-pressed", "true");
      state.os = b.dataset.os;
      render();
    });
  });

  themeToggle.addEventListener("click", () => {
    const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
  });
});
