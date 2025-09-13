function readProfile() {
    return JSON.parse(localStorage.getItem('photolon_profile') || '{}');
}
function writeProfile(p) {
    localStorage.setItem('photolon_profile', JSON.stringify(p));
}
const profileForm = document.getElementById('profileForm');
const profileAvatar = document.getElementById('profileAvatar');
function showAvatar(avatar) {
    if (avatar) {
        profileAvatar.innerHTML = `<img src="${avatar}" alt="avatar" />`;
    } else {
        profileAvatar.innerHTML = `<span class="profile-icon" style="font-size:2.7rem;">👤</span>`;
    }
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
    let file = document.getElementById('profilePic').files[0];
    if (file) {
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
document.getElementById('profilePic').addEventListener('change', function(e){
    let file = e.target.files[0];
    if (file) {
        let reader = new FileReader();
        reader.onload = function(ev) {
            showAvatar(ev.target.result);
        };
        reader.readAsDataURL(file);
    }
});
init();
