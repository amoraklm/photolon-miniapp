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
        if (e.target.closest('.shortcut-switcher')) return;
        section.classList.toggle('open');
    });
    // همه بسته باشند ابتدا
    section.classList.remove('open');
});

// Shortcuts toggle & groups
const shortcutToggle = document.getElementById('shortcutToggle');
const shortcutsAccordion = document.querySelector('.shortcut-accordion-group');
const shortcutsData = {
    win: {
        "عمومی": [
            { action: "کپی", keys: "Ctrl + C" },
            { action: "پیست", keys: "Ctrl + V" },
            { action: "ذخیره", keys: "Ctrl + S" },
            { action: "جداسازی لایه", keys: "Ctrl + J" },
            { action: "Undo", keys: "Ctrl + Z" },
            { action: "Redo", keys: "Ctrl + Shift + Z" },
            { action: "انتخاب همه", keys: "Ctrl + A" },
            { action: "بازکردن فایل", keys: "Ctrl + O" },
            { action: "جدید", keys: "Ctrl + N" },
            { action: "بستن", keys: "Ctrl + W" },
            { action: "ذخیره به نام", keys: "Ctrl + Shift + S" },
            { action: "نمایش خط کش", keys: "Ctrl + R" },
            { action: "زوم این", keys: "Ctrl + +" },
            { action: "زوم اوت", keys: "Ctrl + -" }
        ],
        "ابزارها": [
            { action: "انتخاب ابزار Move", keys: "V" },
            { action: "انتخاب ابزار Brush", keys: "B" },
            { action: "انتخاب ابزار Eraser", keys: "E" },
            { action: "انتخاب ابزار Crop", keys: "C" },
            { action: "انتخاب ابزار Lasso", keys: "L" },
            { action: "انتخاب ابزار Magic Wand", keys: "W" }
        ],
        "ادجسمنت‌ها": [
            { action: "Levels", keys: "Ctrl + L" },
            { action: "Curves", keys: "Ctrl + M" },
            { action: "Hue/Saturation", keys: "Ctrl + U" },
            { action: "Desaturate", keys: "Ctrl + Shift + U" },
            { action: "Black & White", keys: "Ctrl + Alt + Shift + B" }
        ]
    },
    mac: {
        "عمومی": [
            { action: "کپی", keys: "Cmd + C" },
            { action: "پیست", keys: "Cmd + V" },
            { action: "ذخیره", keys: "Cmd + S" },
            { action: "جداسازی لایه", keys: "Cmd + J" },
            { action: "Undo", keys: "Cmd + Z" },
            { action: "Redo", keys: "Cmd + Shift + Z" },
            { action: "انتخاب همه", keys: "Cmd + A" },
            { action: "بازکردن فایل", keys: "Cmd + O" },
            { action: "جدید", keys: "Cmd + N" },
            { action: "بستن", keys: "Cmd + W" },
            { action: "ذخیره به نام", keys: "Cmd + Shift + S" },
            { action: "نمایش خط کش", keys: "Cmd + R" },
            { action: "زوم این", keys: "Cmd + +" },
            { action: "زوم اوت", keys: "Cmd + -" }
        ],
        "ابزارها": [
            { action: "انتخاب ابزار Move", keys: "V" },
            { action: "انتخاب ابزار Brush", keys: "B" },
            { action: "انتخاب ابزار Eraser", keys: "E" },
            { action: "انتخاب ابزار Crop", keys: "C" },
            { action: "انتخاب ابزار Lasso", keys: "L" },
            { action: "انتخاب ابزار Magic Wand", keys: "W" }
        ],
        "ادجسمنت‌ها": [
            { action: "Levels", keys: "Cmd + L" },
            { action: "Curves", keys: "Cmd + M" },
            { action: "Hue/Saturation", keys: "Cmd + U" },
            { action: "Desaturate", keys: "Cmd + Shift + U" },
            { action: "Black & White", keys: "Cmd + Option + Shift + B" }
        ]
    }
};
function renderShortcuts(type) {
    if (!shortcutsAccordion) return;
    shortcutsAccordion.innerHTML = "";
    let data = shortcutsData[type];
    for (let group in data) {
        const category = document.createElement('div');
        category.className = 'shortcut-category';
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'shortcut-category-btn';
        btn.innerHTML = `${group}`;
        const content = document.createElement('div');
        content.className = 'shortcut-category-content';
        content.innerHTML = `
            <div style="overflow-x:auto;">
            <table class="shortcuts-table">
                <thead>
                    <tr><th>عملیات</th><th>کلیدها</th></tr>
                </thead>
                <tbody>
                    ${data[group].map(x => `<tr><td>${x.action}</td><td>${x.keys}</td></tr>`).join('')}
                </tbody>
            </table>
            </div>
        `;
        btn.addEventListener('click', () => {
            category.classList.toggle('open');
        });
        category.appendChild(btn);
        category.appendChild(content);
        shortcutsAccordion.appendChild(category);
    }
    // دسته اول باز باشد
    if (shortcutsAccordion.firstChild) shortcutsAccordion.firstChild.classList.add('open');
}
shortcutToggle && shortcutToggle.addEventListener('change', e => {
    renderShortcuts(shortcutToggle.checked ? 'mac' : 'win');
    // انیمیت سوییچ
    const thumb = e.target.closest('.switch-track').querySelector('.switch-thumb');
    thumb.classList.add('switched');
    setTimeout(() => thumb.classList.remove('switched'), 320);
});
if (shortcutsAccordion) renderShortcuts('win');

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
