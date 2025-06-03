function toggleSubmenu(event) {
  event.preventDefault();
  event.stopPropagation();

  const link = event.currentTarget;
  const submenu = link.nextElementSibling;
  const icon = link.querySelector(".submenu-icon");
  const isOpen = submenu.classList.contains("show");

  // Închide toate
  document.querySelectorAll(".submenu-right").forEach(el => el.classList.remove("show"));
  document.querySelectorAll(".submenu-icon").forEach(el => el.classList.remove("rotate"));

  // Dacă era deja deschis → îl închide (și gata)
  if (isOpen) return;

  // Altfel îl deschide
  const rect = link.getBoundingClientRect();
  submenu.style.top = `${rect.top}px`;
  submenu.style.left = `${rect.right + 15}px`;

  submenu.classList.add("show");
  if (icon) icon.classList.add("rotate");
}