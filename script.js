// اینجا فعلاً دیتا استاتیکه، ولی میشه از API یا فایل JSON آپدیتش کرد
console.log("پنل آزمایشی لود شد")

// نمونه تغییر محتوا بعد از 3 ثانیه (برای حس داینامیک)
setTimeout(() => {
  document.querySelector("#status li:first-child strong").textContent = "۵۰٪"
}, 3000)