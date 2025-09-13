function readProfile() {
    return JSON.parse(localStorage.getItem('photolon_profile') || '{}');
}
function writeProfile(p) {
    localStorage.setItem('photolon_profile', JSON.stringify(p));
}
const profileForm = document.getElementById('profileForm');
const profileAvatar = document.getElementById('profileAvatar');
const profilePicInput = document.getElementById('profilePic');
function showAvatar(avatar) {
    if (avatar) {
        profileAvatar.innerHTML = `<img src="${avatar}" alt="avatar" />`;
    } else {
        profileAvatar.innerHTML = `<span class="profile-icon" style="font-size:2.7rem;">👤</span>`;
    }
}
function validateImage(file) {
    const valid = ['image/png','image/jpeg','image/jpg','image/webp'];
    return file && valid.includes(file.type) && file.size <= 2 * 1024 * 1024;
}
function init() {
    let p = readProfile();
    if (p.name) document.getElementById('profileName').value = p.name;
    if (p.family) document.getElementById('profileFamily').value = p.family;
    if (p.email) document.getElementById('profileEmail').value = p.email;
    if (p.phone) document.getElementById('profilePhone').value = p.phone;
    showAvatar(p.avatar);
}
profileForm.addEventListener('submit', function(e) {
    e.preventDefault();
    let name = document.getElementById('profileName').value.trim();
    let family = document.getElementById('profileFamily').value.trim();
    let email = document.getElementById('profileEmail').value.trim();
    let phone = document.getElementById('profilePhone').value.trim();
    if (!name || !family) {
        alert('نام و نام خانوادگی الزامی است');
        return;
    }
    let p = { name, family, email, phone };
    // اگر عکسی انتخاب شده
    const file = profilePicInput.files[0];
    if (file) {
        if (!validateImage(file)) {
            alert('فقط عکس با فرمت jpg/png/webp و حجم کمتر از ۲ مگابایت مجاز است!');
            return;
        }
        let reader = new FileReader();
        reader.onload = function(ev) {
            p.avatar = ev.target.result;
            writeProfile(p);
            window.location = "index.html";
        };
        reader.readAsDataURL(file);
    } else {
        p.avatar = readProfile().avatar || null;
        writeProfile(p);
        window.location = "index.html";
    }
});
profilePicInput.addEventListener('change', function(e){
    let file = e.target.files[0];
    if (file && validateImage(file)) {
        let reader = new FileReader();
        reader.onload = function(ev) {
            showAvatar(ev.target.result);
        };
        reader.readAsDataURL(file);
    } else if (file) {
        alert('فقط عکس با فرمت jpg/png/webp و حجم کمتر از ۲ مگابایت مجاز است!');
        profilePicInput.value = '';
        showAvatar(readProfile().avatar);
    } else {
        showAvatar(readProfile().avatar);
    }
});
init();
