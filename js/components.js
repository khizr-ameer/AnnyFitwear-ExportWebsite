async function loadComponent(selector, file) {
  const element = document.querySelector(selector);
  if (!element) return;

  try {
    const response = await fetch(file);
    element.innerHTML = await response.text();
    
    // Initialize component-specific functionality after loading
    initializeComponent(selector);
    
  } catch (error) {
    console.error(`Error loading ${file}`, error);
  }
}

// Initialize specific component functionality
function initializeComponent(selector) {
  // Small delay to ensure DOM is fully ready
  setTimeout(() => {
    switch(selector) {
      case "#hero":
        if (typeof initHeroSlider === 'function') {
          initHeroSlider();
        }
        break;
      
      case "#navbar":
        if (typeof initNavbar === 'function') {
          initNavbar();
        }
        break;
      
      case "#testimonials":
        if (typeof initTestimonials === 'function') {
          initTestimonials();
        }
        break;
      
      case "#featured-products":
        if (typeof initFeaturedProducts === 'function') {
          initFeaturedProducts();
        }
        break;
      
      case "#categories":
        if (typeof initCategories === 'function') {
          initCategories();
        }
        break;
      
      // Add more cases as needed for other components
      default:
        console.log(`${selector} loaded, no specific initialization needed`);
    }
  }, 100);
}

document.addEventListener("DOMContentLoaded", () => {
  // Load all components
  loadComponent("#navbar", "components/navbar.html");
  loadComponent("#hero", "components/hero.html");
  loadComponent("#about", "components/intro.html");
  loadComponent("#featured-products", "components/featured-products.html");
  loadComponent("#customization", "components/customization.html");
  loadComponent("#manufacturing", "components/manufacturing.html");
  loadComponent("#choose", "components/choose-us.html");
  loadComponent("#testimonials", "components/testimonials.html");
  loadComponent("#certification", "components/certification.html");
  loadComponent("#categories", "components/categories.html");
  loadComponent("#footer", "components/footer.html");
});