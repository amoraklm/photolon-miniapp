// Theme switching
const themeToggleBtn = document.getElementById('themeToggle');
function setTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('photolon_theme', theme);
}
function toggleTheme() {
    const current = document.body.getAttribute('data-theme') || 'light';
    setTheme(current === 'dark' ? 'light' : 'dark');
}
if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
    // Init theme from localStorage
    const saved = localStorage.getItem('photolon_theme');
    setTheme(saved || 'light');
}

// Accordion sections
document.querySelectorAll('.accordion-section').forEach((section, i) => {
    const btn = section.querySelector('.accordion-btn');
    btn.addEventListener('click', function (e) {
        if (e.target.matches('#shortcutToggle')) return;
        section.classList.toggle('open');
    });
    // اولی باز باشه به صورت پیشفرض
    if (i === 0) section.classList.add('open');
});

// Shortcuts toggle
const shortcutToggle = document.getElementById('shortcutToggle');
const shortcutsList = document.getElementById('shortcutsList');
const shortcuts = {
    win: [
        { action: "کپی", keys: "Ctrl + C" },
        { action: "پیست", keys: "Ctrl + V" },
        { action: "ذخیره", keys: "Ctrl + S" },
        { action: "جداسازی لایه", keys: "Ctrl + J" },
        { action: "Undo", keys: "Ctrl + Z" },
        { action: "Redo", keys: "Ctrl + Shift + Z" },
        { action: "جداسازی انتخاب", keys: "Ctrl + Shift + I" },
        { action: "تبدیل آزاد", keys: "Ctrl + T" },
        { action: "انتخاب همه", keys: "Ctrl + A" },
        { action: "بازکردن فایل", keys: "Ctrl + O" },
        { action: "جدید", keys: "Ctrl + N" },
        { action: "بستن", keys: "Ctrl + W" },
        { action: "ذخیره به نام", keys: "Ctrl + Shift + S" },
        { action: "نمایش شبکه", keys: "Ctrl + '" },
        { action: "نمایش خط کش", keys: "Ctrl + R" },
        { action: "زوم این", keys: "Ctrl + +" },
        { action: "زوم اوت", keys: "Ctrl + -" },
        { action: "نمایش/پنهان کردن پانل‌ها", keys: "Tab" },
        { action: "انتخاب ابزار Brush", keys: "B" },
        { action: "انتخاب ابزار Move", keys: "V" },
        // ... بقیه موارد
    ],
    mac: [
        { action: "کپی", keys: "Cmd + C" },
        { action: "پیست", keys: "Cmd + V" },
        { action: "ذخیره", keys: "Cmd + S" },
        { action: "جداسازی لایه", keys: "Cmd + J" },
        { action: "Undo", keys: "Cmd + Z" },
        { action: "Redo", keys: "Cmd + Shift + Z" },
        { action: "جداسازی انتخاب", keys: "Cmd + Shift + I" },
        { action: "تبدیل آزاد", keys: "Cmd + T" },
        { action: "انتخاب همه", keys: "Cmd + A" },
        { action: "بازکردن فایل", keys: "Cmd + O" },
        { action: "جدید", keys: "Cmd + N" },
        { action: "بستن", keys: "Cmd + W" },
        { action: "ذخیره به نام", keys: "Cmd + Shift + S" },
        { action: "نمایش شبکه", keys: "Cmd + '" },
        { action: "نمایش خط کش", keys: "Cmd + R" },
        { action: "زوم این", keys: "Cmd + +" },
        { action: "زوم اوت", keys: "Cmd + -" },
        { action: "نمایش/پنهان کردن پانل‌ها", keys: "Tab" },
        { action: "انتخاب ابزار Brush", keys: "B" },
        { action: "انتخاب ابزار Move", keys: "V" },
        // ... بقیه موارد
    ]
};
function renderShortcuts(type) {
    let data = shortcuts[type];
    let html = `
        <div class="shortcut-group">
            <table class="shortcuts-table">
                <thead>
                    <tr><th>عملیات</th><th>کلیدها</th></tr>
                </thead>
                <tbody>
                    ${data.map(x => `<tr><td>${x.action}</td><td>${x.keys}</td></tr>`).join('')}
                </tbody>
            </table>
        </div>
    `;
    shortcutsList.innerHTML = html;
}
shortcutToggle && shortcutToggle.addEventListener('change', e => {
    renderShortcuts(shortcutToggle.checked ? 'mac' : 'win');
});
if (shortcutsList) renderShortcuts('win');

// Profile mini (header)
function showProfileMini() {
    let p = JSON.parse(localStorage.getItem('photolon_profile') || '{}');
    const el = document.getElementById('profileMini');
    if (!el) return;
    if (p && p.name && p.family) {
        el.innerHTML = `
            ${p.avatar ? `<img src="${p.avatar}" alt="avatar">` : `<span class="profile-icon">👤</span>`}
            <div class="profile-name">${p.name} ${p.family}</div>
        `;
    } else {
        el.innerHTML = `<span class="profile-icon">👤</span>`;
    }
    el.onclick = () => { window.location = "profile.html"; };
}
showProfileMini();

// Toast for update
if (!localStorage.getItem("photolon_update_1_0_0_1")) {
    showToast("نسخه جدید 1.0.0.1 با خدمات و ظاهر جدید منتشر شد 🌟");
    localStorage.setItem("photolon_update_1_0_0_1", "shown");
}
function showToast(msg) {
    let toast = document.createElement("div");
    toast.textContent = msg;
    toast.className = "simple-toast";
    document.body.appendChild(toast);
    setTimeout(() => { toast.classList.add("show"); }, 100);
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    }, 4200);
}
