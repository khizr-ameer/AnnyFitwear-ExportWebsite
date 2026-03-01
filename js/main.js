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
// HERO SLIDER - INITIALIZATION FUNCTION
// ===============================

function initHeroSlider() {
  const slides       = document.querySelectorAll(".hero-slide");
  const dots         = document.querySelectorAll(".hero-track .dot");
  const captions     = document.querySelectorAll(".caption-slide");
  const trackFill    = document.querySelector(".track-fill");

  if (!slides.length || !dots.length) {
    console.log("Hero slider elements not found yet");
    return;
  }

  let currentSlide = 0;
  let autoSlideInterval;

  // Update track fill position to indicate current dot
  function updateTrackFill(index) {
    if (!trackFill) return;
    const pct = (index / (slides.length - 1)) * 100;
    trackFill.style.height = `${(index + 1) / slides.length * 100}%`;
  }

  // Show slide by index
  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
    captions.forEach((cap, i) => {
      cap.classList.toggle("active", i === index);
    });
    updateTrackFill(index);
    currentSlide = index;
  }

  // Next slide
  function nextSlide() {
    showSlide((currentSlide + 1) % slides.length);
  }

  // Auto-slide control
  function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 6000);
  }
  function stopAutoSlide() {
    clearInterval(autoSlideInterval);
  }

  // Dot clicks
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      stopAutoSlide();
      showSlide(index);
      startAutoSlide();
    });
  });

  // Pause on hover over stage
  const heroStage = document.querySelector(".hero-stage");
  if (heroStage) {
    heroStage.addEventListener("mouseenter", stopAutoSlide);
    heroStage.addEventListener("mouseleave", startAutoSlide);
  }

  // Initialise
  showSlide(0);
  startAutoSlide();

  console.log("Hero slider initialized successfully");
}

// ===============================
// TESTIMONIALS INITIALIZATION
// ===============================

function initTestimonials() {
  const testimonialSlides = document.querySelectorAll(".testimonial-slide");
  const dots = document.querySelectorAll(".testi-dots span");
  const prevBtn = document.querySelector(".prev-testi");
  const nextBtn = document.querySelector(".next-testi");

  if (!testimonialSlides.length) {
    console.log("Testimonials not found");
    return;
  }

  let currentTestimonial = 0;
  let testimonialInterval;

  function showTestimonial(index) {
    testimonialSlides.forEach(slide => slide.classList.remove("active"));
    dots.forEach(dot => dot.classList.remove("active"));
    testimonialSlides[index].classList.add("active");
    dots[index].classList.add("active");
    currentTestimonial = index;
  }

  function nextTestimonial() {
    showTestimonial((currentTestimonial + 1) % testimonialSlides.length);
  }

  function prevTestimonial() {
    showTestimonial((currentTestimonial - 1 + testimonialSlides.length) % testimonialSlides.length);
  }

  function startTestimonialSlide() {
    testimonialInterval = setInterval(nextTestimonial, 5000);
  }
  function stopTestimonialSlide() {
    clearInterval(testimonialInterval);
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      stopTestimonialSlide(); nextTestimonial(); startTestimonialSlide();
    });
  }
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      stopTestimonialSlide(); prevTestimonial(); startTestimonialSlide();
    });
  }

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      stopTestimonialSlide(); showTestimonial(index); startTestimonialSlide();
    });
  });

  const testimonialCarousel = document.querySelector(".testimonials-carousel");
  if (testimonialCarousel) {
    testimonialCarousel.addEventListener("mouseenter", stopTestimonialSlide);
    testimonialCarousel.addEventListener("mouseleave", startTestimonialSlide);
  }

  const activeSlide = Array.from(testimonialSlides).findIndex(s => s.classList.contains("active"));
  currentTestimonial = activeSlide !== -1 ? activeSlide : 0;
  showTestimonial(currentTestimonial);
  startTestimonialSlide();

  console.log("Testimonials initialized successfully");
}

// ===============================
// ACTIVE NAV LINKS
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  const currentPath = window.location.pathname.split("/").pop();
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach(link => {
    const linkPath = link.getAttribute("href");

    if (linkPath === currentPath) {
      link.classList.add("active");
    }

    if (
      linkPath === "products.html" &&
      (
        currentPath.includes("products") ||
        currentPath.includes("motorbike") ||
        currentPath.includes("leather") ||
        currentPath.includes("fashion") ||
        currentPath.includes("moto")
      )
    ) {
      link.classList.add("active");
    }
  });

  // Init sliders on DOMContentLoaded
  initHeroSlider();
  initTestimonials();
});