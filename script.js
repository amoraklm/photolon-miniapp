// �Ә��� �� Ә�� �������
function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: "smooth" });
}

// �ݘ� �Ә��� ���� ���ʝ��
window.addEventListener("scroll", () => {
  document.querySelectorAll(".card").forEach(card => {
    const rect = card.getBoundingClientRect();
    if (rect.top < window.innerHeight - 50) {
      card.style.opacity = 1;
      card.style.transform = "translateY(0)";
    }
  });
});
