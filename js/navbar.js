// ========================================
// NAVBAR FUNCTIONALITY
// Gold & Black Premium Theme
// Mobile Menu, Dropdowns, Scroll Effects
// ========================================

document.addEventListener('DOMContentLoaded', function() {
  
  // ================================
  // DOM ELEMENTS
  // ================================
  const header = document.querySelector('.header');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navList = document.getElementById('nav-list');
  const dropdowns = document.querySelectorAll('.dropdown');
  const navLinks = document.querySelectorAll('.nav-link');
  const body = document.body;
  
  // ================================
  // MOBILE MENU TOGGLE
  // ================================
  if (mobileMenuBtn && navList) {
    mobileMenuBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      toggleMobileMenu();
    });
  }
  
  function toggleMobileMenu() {
    const isActive = navList.classList.contains('active');
    
    if (isActive) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }
  
  function openMobileMenu() {
    navList.classList.add('active');
    mobileMenuBtn.classList.add('active');
    body.style.overflow = 'hidden'; // Prevent body scroll
    
    // ARIA attributes
    mobileMenuBtn.setAttribute('aria-expanded', 'true');
    navList.setAttribute('aria-hidden', 'false');
  }
  
  function closeMobileMenu() {
    navList.classList.remove('active');
    mobileMenuBtn.classList.remove('active');
    body.style.overflow = '';
    
    // Close all dropdowns
    dropdowns.forEach(dropdown => {
      dropdown.classList.remove('open');
    });
    
    // ARIA attributes
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    navList.setAttribute('aria-hidden', 'true');
  }
  
  // ================================
  // CLOSE MENU ON LINK CLICK (Mobile)
  // ================================
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // Don't close if it's a dropdown toggle
      if (!this.classList.contains('dropdown-toggle') && window.innerWidth < 1025) {
        setTimeout(() => {
          closeMobileMenu();
        }, 200);
      }
    });
  });
  
  // ================================
  // CLOSE MENU ON OUTSIDE CLICK
  // ================================
  document.addEventListener('click', function(e) {
    if (window.innerWidth < 1025 && navList.classList.contains('active')) {
      if (!navList.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        closeMobileMenu();
      }
    }
  });
  
  // ================================
  // DROPDOWN FUNCTIONALITY
  // ================================
  dropdowns.forEach(dropdown => {
    const dropdownToggle = dropdown.querySelector('.dropdown-toggle');
    const dropdownMenu = dropdown.querySelector('.dropdown-menu');
    
    if (dropdownToggle) {
      // Mobile: Click to toggle
      dropdownToggle.addEventListener('click', function(e) {
        if (window.innerWidth < 1025) {
          e.preventDefault();
          
          // Close other dropdowns
          dropdowns.forEach(otherDropdown => {
            if (otherDropdown !== dropdown) {
              otherDropdown.classList.remove('open');
            }
          });
          
          // Toggle current dropdown
          const isOpen = dropdown.classList.toggle('open');
          dropdownToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        }
      });
      
      // Desktop: Hover behavior is handled by CSS
    }
  });
  
  // ================================
  // HEADER SCROLL EFFECT
  // ================================
  let lastScroll = 0;
  
  window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    
    // Add scrolled class when scrolled down
    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  });
  
  // ================================
  // ACTIVE LINK HIGHLIGHTING
  // ================================
  function setActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
      const linkPage = link.getAttribute('href');
      
      // Remove active from all
      link.classList.remove('active');
      
      // Add active to current page
      if (linkPage === currentPage || 
          (currentPage === '' && linkPage === 'index.html') ||
          (currentPage === 'index.html' && linkPage === 'index.html')) {
        link.classList.add('active');
      }
    });
  }
  
  setActiveLink();
  
  // ================================
  // CART & WISHLIST COUNT UPDATE
  // ================================
  function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    const wishlistCount = document.querySelector('.wishlist-count');
    
    // Get counts from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    if (cartCount) {
      const count = cart.length;
      if (count > 0) {
        cartCount.textContent = count;
        cartCount.style.display = 'block';
      } else {
        cartCount.style.display = 'none';
      }
    }
    
    if (wishlistCount) {
      const count = wishlist.length;
      if (count > 0) {
        wishlistCount.textContent = count;
        wishlistCount.style.display = 'block';
      } else {
        wishlistCount.style.display = 'none';
      }
    }
  }
  
  updateCartCount();
  
  // Listen for storage changes (from other tabs)
  window.addEventListener('storage', updateCartCount);
  
  // Custom events for cart/wishlist updates (same tab)
  window.addEventListener('cartUpdated', updateCartCount);
  window.addEventListener('wishlistUpdated', updateCartCount);
  
  // ================================
  // CLOSE MENU ON WINDOW RESIZE
  // ================================
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      if (window.innerWidth >= 1025) {
        closeMobileMenu();
      }
    }, 250);
  });
  
  // ================================
  // KEYBOARD NAVIGATION
  // ================================
  
  // ESC key to close mobile menu
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && navList.classList.contains('active')) {
      closeMobileMenu();
      mobileMenuBtn.focus();
    }
  });
  
  // Focus trap in mobile menu when open
  if (navList) {
    const focusableElements = navList.querySelectorAll(
      'a[href], button:not([disabled])'
    );
    
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    navList.addEventListener('keydown', function(e) {
      if (!navList.classList.contains('active')) return;
      
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable.focus();
          }
        }
      }
    });
  }
  
  // ================================
  // SMOOTH SCROLL TO TOP ON LOGO CLICK
  // ================================
  const logo = document.querySelector('.logo');
  if (logo) {
    logo.addEventListener('click', function(e) {
      const currentPath = window.location.pathname;
      const isIndex = currentPath.includes('index.html') || 
                      currentPath === '/' || 
                      currentPath === '';
      
      if (isIndex) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }
  
  // ================================
  // PREFETCH LINKS ON HOVER (Performance)
  // ================================
  const prefetchedLinks = new Set();
  
  const prefetchLink = (url) => {
    if (prefetchedLinks.has(url)) return;
    
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
    prefetchedLinks.add(url);
  };
  
  navLinks.forEach(link => {
    link.addEventListener('mouseenter', function() {
      const url = this.getAttribute('href');
      if (url && !url.startsWith('#') && window.innerWidth >= 1025) {
        prefetchLink(url);
      }
    }, { once: true });
  });
  
  // ================================
  // CONSOLE LOG (Development)
  // ================================
  console.log('🏍️ Anny Fitwear Navbar Initialized');
  console.log('✨ Gold & Black Premium Theme');
});

// ================================
// HELPER FUNCTIONS (Global)
// ================================

// Function to manually update cart count
// Call this after adding/removing items from cart
window.updateNavbarCounts = function() {
  window.dispatchEvent(new Event('cartUpdated'));
  window.dispatchEvent(new Event('wishlistUpdated'));
};

// Function to set active nav link programmatically
window.setNavActive = function(href) {
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === href) {
      link.classList.add('active');
    }
  });
};