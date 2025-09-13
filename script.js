// نسخه 1.0.0.1 - اسکریپت ساده برای بهبود تعامل کاربری و نمایش اطلاعیه‌ها

document.addEventListener("DOMContentLoaded", function () {
    // مثال: نمایش toast ساده برای اطلاع از آپدیت
    if (!localStorage.getItem("photolon_update_1_0_0_1")) {
        showToast("نسخه جدید 1.0.0.1 با خدمات و ظاهر جدید منتشر شد 🌟");
        localStorage.setItem("photolon_update_1_0_0_1", "shown");
    }
});

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

// استایل toast را به صورت داینامیک اضافه می‌کنیم
(function(){
    let style = document.createElement('style');
    style.innerHTML = `
    .simple-toast {
        visibility: hidden;
        min-width: 220px;
        background-color: #111827de;
        color: #fff;
        text-align: center;
        border-radius: 8px;
        padding: 12px 20px;
        position: fixed;
        z-index: 99;
        left: 50%;
        transform: translateX(-50%);
        bottom: 40px;
        font-size: 1rem;
        opacity: 0;
        transition: all 0.4s;
        box-shadow: 0 4px 22px rgba(56,189,248,0.18);
    }
    .simple-toast.show {
        visibility: visible;
        opacity: 1;
        bottom: 70px;
    }`;
    document.head.appendChild(style);
})();
