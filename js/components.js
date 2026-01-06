async function loadComponent(selector, file) {
  const element = document.querySelector(selector);
  if (!element) return;

  try {
    const response = await fetch(file);
    element.innerHTML = await response.text();
  } catch (error) {
    console.error(`Error loading ${file}`, error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadComponent("#navbar", "components/navbar.html");
  loadComponent("#hero", "components/hero.html");
  loadComponent("#categories", "components/categories.html");
  loadComponent("#footer", "components/footer.html");
});
