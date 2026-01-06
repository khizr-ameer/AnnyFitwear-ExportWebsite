document.addEventListener("click", function (e) {

  const navList = document.querySelector(".nav-list");

  /* =========================
     MOBILE MENU TOGGLE
  ========================= */
  if (e.target.closest("#mobile-menu-btn")) {
    navList.classList.toggle("active");
    return;
  }

  /* =========================
     CLOSE MENU ON LINK CLICK
  ========================= */
  if (e.target.classList.contains("nav-link") && window.innerWidth <= 1024) {
    navList.classList.remove("active");
  }

  /* =========================
     DROPDOWN TOGGLE (MOBILE)
  ========================= */
  const dropdownLink = e.target.closest(".dropdown > a");
  if (dropdownLink && window.innerWidth <= 1024) {
    e.preventDefault();
    dropdownLink.parentElement.classList.toggle("open");
  }

});

// ===============================
// HERO SLIDER
// ===============================

const slides = document.querySelectorAll(".hero-slide");
const dots = document.querySelectorAll(".hero-controls .dot");
let currentSlide = 0;

// Show slide by index
function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle("active", i === index);
    dots[i].classList.toggle("active", i === index);
  });
  currentSlide = index;
}

// Auto-slide every 6 seconds
setInterval(() => {
  let next = (currentSlide + 1) % slides.length;
  showSlide(next);
}, 6000);

// Manual navigation via dots
dots.forEach((dot, index) => {
  dot.addEventListener("click", () => showSlide(index));
});
