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
  const slides = document.querySelectorAll(".hero-slide");
  const dots = document.querySelectorAll(".hero-controls .dot");
  
  // Check if elements exist
  if (!slides.length || !dots.length) {
    console.log("Hero slider elements not found yet");
    return;
  }

  let currentSlide = 0;
  let autoSlideInterval;

  // Show slide by index
  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
      dots[i].classList.toggle("active", i === index);
    });
    currentSlide = index;
  }

  // Next slide function
  function nextSlide() {
    let next = (currentSlide + 1) % slides.length;
    showSlide(next);
  }

  // Start auto-slide
  function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 6000); // 6 seconds
  }

  // Stop auto-slide
  function stopAutoSlide() {
    clearInterval(autoSlideInterval);
  }

  // Manual navigation via dots
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      stopAutoSlide();
      showSlide(index);
      startAutoSlide(); // Restart after manual click
    });
  });

  // Optional: Pause on hover
  const heroCard = document.querySelector(".hero-card");
  if (heroCard) {
    heroCard.addEventListener("mouseenter", stopAutoSlide);
    heroCard.addEventListener("mouseleave", startAutoSlide);
  }

  // Start the auto-slide
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

  // Show testimonial by index
  function showTestimonial(index) {
    // Remove active class from all slides and dots
    testimonialSlides.forEach((slide) => {
      slide.classList.remove("active");
    });
    
    dots.forEach((dot) => {
      dot.classList.remove("active");
    });
    
    // Add active class to current slide and dot
    testimonialSlides[index].classList.add("active");
    dots[index].classList.add("active");
    
    currentTestimonial = index;
  }

  // Next testimonial
  function nextTestimonial() {
    let next = (currentTestimonial + 1) % testimonialSlides.length;
    showTestimonial(next);
  }

  // Previous testimonial
  function prevTestimonial() {
    let prev = (currentTestimonial - 1 + testimonialSlides.length) % testimonialSlides.length;
    showTestimonial(prev);
  }

  // Start auto-slide
  function startTestimonialSlide() {
    testimonialInterval = setInterval(nextTestimonial, 5000); // 5 seconds
  }

  // Stop auto-slide
  function stopTestimonialSlide() {
    clearInterval(testimonialInterval);
  }

  // Next button click
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      stopTestimonialSlide();
      nextTestimonial();
      startTestimonialSlide();
    });
  }

  // Previous button click
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      stopTestimonialSlide();
      prevTestimonial();
      startTestimonialSlide();
    });
  }

  // Dot navigation
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      stopTestimonialSlide();
      showTestimonial(index);
      startTestimonialSlide();
    });
  });

  // Pause on hover (optional)
  const testimonialCarousel = document.querySelector(".testimonials-carousel");
  if (testimonialCarousel) {
    testimonialCarousel.addEventListener("mouseenter", stopTestimonialSlide);
    testimonialCarousel.addEventListener("mouseleave", startTestimonialSlide);
  }

  // Initialize: Find which slide has 'active' class or default to first
  const activeSlide = Array.from(testimonialSlides).findIndex(slide => slide.classList.contains('active'));
  if (activeSlide !== -1) {
    currentTestimonial = activeSlide;
  } else {
    showTestimonial(0); // Default to first slide if none active
  }

  // Start auto-slide
  startTestimonialSlide();
  
  console.log("Testimonials initialized successfully");
}

  document.addEventListener("DOMContentLoaded", () => {
  const currentPath = window.location.pathname.split("/").pop();

  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach(link => {
    const linkPath = link.getAttribute("href");

    // Exact match (home, about, contact, etc.)
    if (linkPath === currentPath) {
      link.classList.add("active");
    }

    // Products parent active on all product-related pages
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
});
