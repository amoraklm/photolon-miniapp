// شورتکات‌ها
const shortcuts = {
  Windows: [
    "Ctrl + J → کپی سریع لایه",
    "Alt + Scroll → زوم سریع",
    "Shift + Drag → تناسب حفظ شود"
  ],
  Mac: [
    "Cmd + J → کپی سریع لایه",
    "Option + Scroll → زوم سریع",
    "Shift + Drag → تناسب حفظ شود"
  ]
};

const shortcutsList = document.getElementById("shortcutsList");
const osLabel = document.getElementById("osLabel");
const osToggle = document.getElementById("osToggle");

function renderShortcuts(os) {
  shortcutsList.innerHTML = "";
  shortcuts[os].forEach(s => {
    let li = document.createElement("li");
    li.textContent = s;
    shortcutsList.appendChild(li);
  });
}
renderShortcuts("Windows");

// باز و بسته شدن کرکره‌ای
function toggleAccordion() {
  const content = document.querySelector(".accordion-content");
  const arrow = document.getElementById("arrow");
  content.classList.toggle("active");
  arrow.textContent = content.classList.contains("active") ? "▲" : "▼";
}

// تغییر سیستم عامل
function toggleOS() {
  if (osToggle.checked) {
    osLabel.textContent = "Mac";
    renderShortcuts("Mac");
  } else {
    osLabel.textContent = "Windows";
    renderShortcuts("Windows");
  }
}
