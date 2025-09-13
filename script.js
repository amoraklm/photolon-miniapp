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
  const saved = localStorage.getItem('photolon_theme');
  setTheme(saved || 'light');
}

// پروفایل مینی (هدر)
function showProfileMini() {
  let p = JSON.parse(localStorage.getItem('photolon_profile') || '{}');
  const el = document.getElementById('profileMini');
  if (!el) return;
  if (p && p.avatar) {
    el.innerHTML = `<img src="${p.avatar}" alt="avatar">`;
  } else {
    el.innerHTML = `<span class="profile-icon">👤</span>`;
  }
  el.onclick = () => { window.location = "profile.html"; };
}
showProfileMini();
