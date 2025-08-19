// ÇÓ˜Ñæá Èå Ó˜Ôä ãæÑÏäÙÑ
function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: "smooth" });
}

// ÇÝ˜Ê ÇÓ˜Ñæá ÈÑÇí ˜ÇÑÊåÇ
window.addEventListener("scroll", () => {
  document.querySelectorAll(".card").forEach(card => {
    const rect = card.getBoundingClientRect();
    if (rect.top < window.innerHeight - 50) {
      card.style.opacity = 1;
      card.style.transform = "translateY(0)";
    }
  });
});
