// script.js
document.addEventListener('DOMContentLoaded', () => {
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();

    // منو موبایل
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // نویگیشن نرم
    window.navigateTo = (sectionId) => {
        document.querySelector(sectionId).scrollIntoView({ behavior: 'smooth' });
    };

    // باز کردن چت پشتیبانی (با بات تلگرام)
    window.openSupportChat = () => {
        Telegram.WebApp.openTelegramLink('[LINK_TO_SUPPORT_BOT]'); // لینک بات پشتیبانی را جایگزین کنید
    };

    // دستیار ساده (می‌توانید با API واقعی مثل Grok یا custom backend گسترش دهید)
    window.askAssistant = () => {
        const input = document.getElementById('assistant-input').value;
        const responseDiv = document.getElementById('assistant-response');
        if (input.trim() === '') return;

        // پاسخ نمونه (برای واقعی، از fetch به API استفاده کنید)
        let response = 'پاسخ نمونه: ';
        if (input.includes('تکلیف')) {
            response += 'برای ارسال تکالیف، به سامانه تکالیف مراجعه کنید.';
        } else if (input.includes('ویدم')) {
            response += 'راهنمای نصب ویدم در بخش منابع موجود است.';
        } else {
            response += 'سؤال شما ثبت شد. لطفاً با پشتیبانی تماس بگیرید.';
        }

        responseDiv.innerHTML = `<p>${response}</p>`;
    };
});
