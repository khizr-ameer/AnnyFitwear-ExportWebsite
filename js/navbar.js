/**
 * Navbar JavaScript
 * Handles mobile menu, dropdowns, scroll effects, and active page detection
 */

(function() {
  'use strict';

  // ==========================================
  // DOM ELEMENTS
  // ==========================================
  const header = document.querySelector('.header');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navList = document.getElementById('nav-list');
  const dropdowns = document.querySelectorAll('.dropdown');
  const body = document.body;

  // ==========================================
  // MOBILE MENU TOGGLE
  // ==========================================
  if (mobileMenuBtn && navList) {
    mobileMenuBtn.addEventListener('click', function() {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      
      // Toggle menu
      navList.classList.toggle('active');
      this.classList.toggle('active');
      
      // Update ARIA
      this.setAttribute('aria-expanded', !isExpanded);
      
      // Toggle icon
      const icon = this.querySelector('i');
      if (icon) {
        if (navList.classList.contains('active')) {
          icon.classList.remove('fa-bars');
          icon.classList.add('fa-times');
        } else {
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
        }
      }
      
      // Prevent body scroll when menu is open
      if (navList.classList.contains('active')) {
        body.style.overflow = 'hidden';
      } else {
        body.style.overflow = '';
      }
    });
  }

  // ==========================================
  // MOBILE DROPDOWN TOGGLE
  // ==========================================
  dropdowns.forEach(dropdown => {
    const link = dropdown.querySelector('.nav-link');
    const menu = dropdown.querySelector('.dropdown-menu');
    
    if (link && menu) {
      // Mobile dropdown toggle
      link.addEventListener('click', function(e) {
        // Only prevent default on mobile
        if (window.innerWidth <= 1024) {
          e.preventDefault();
          
          const isOpen = dropdown.classList.contains('open');
          
          // Close all other dropdowns
          dropdowns.forEach(d => {
            if (d !== dropdown) {
              d.classList.remove('open');
              const otherLink = d.querySelector('.nav-link');
              if (otherLink) {
                otherLink.setAttribute('aria-expanded', 'false');
              }
            }
          });
          
          // Toggle current dropdown
          dropdown.classList.toggle('open');
          this.setAttribute('aria-expanded', !isOpen);
        }
      });
    }
  });

  // ==========================================
  // CLOSE MOBILE MENU ON LINK CLICK
  // ==========================================
  const navLinks = navList?.querySelectorAll('.nav-link:not(.dropdown .nav-link)');
  navLinks?.forEach(link => {
    link.addEventListener('click', function() {
      if (window.innerWidth <= 1024 && navList.classList.contains('active')) {
        navList.classList.remove('active');
        mobileMenuBtn?.classList.remove('active');
        mobileMenuBtn?.setAttribute('aria-expanded', 'false');
        body.style.overflow = '';
        
        // Reset icon
        const icon = mobileMenuBtn?.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
        }
      }
    });
  });

  // Also close on dropdown item click
  const dropdownItems = document.querySelectorAll('.dropdown-item');
  dropdownItems?.forEach(item => {
    item.addEventListener('click', function() {
      if (window.innerWidth <= 1024 && navList?.classList.contains('active')) {
        navList.classList.remove('active');
        mobileMenuBtn?.classList.remove('active');
        mobileMenuBtn?.setAttribute('aria-expanded', 'false');
        body.style.overflow = '';
        
        const icon = mobileMenuBtn?.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
        }
      }
    });
  });

  // ==========================================
  // SCROLL EFFECTS
  // ==========================================
  let lastScrollY = window.scrollY;
  let ticking = false;

  function updateHeaderOnScroll() {
    const scrollY = window.scrollY;
    
    // Add scrolled class for shadow effect
    if (scrollY > 50) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
    
    lastScrollY = scrollY;
    ticking = false;
  }

  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(updateHeaderOnScroll);
      ticking = true;
    }
  });

  // ==========================================
  // CLOSE MENU ON ESC KEY
  // ==========================================
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      // Close mobile menu
      if (navList?.classList.contains('active')) {
        navList.classList.remove('active');
        mobileMenuBtn?.classList.remove('active');
        mobileMenuBtn?.setAttribute('aria-expanded', 'false');
        body.style.overflow = '';
        
        const icon = mobileMenuBtn?.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
        }
      }
      
      // Close dropdowns
      dropdowns.forEach(dropdown => {
        dropdown.classList.remove('open');
        const link = dropdown.querySelector('.nav-link');
        if (link) {
          link.setAttribute('aria-expanded', 'false');
        }
      });
    }
  });

  // ==========================================
  // CLOSE MENU ON OUTSIDE CLICK
  // ==========================================
  document.addEventListener('click', function(e) {
    // Close mobile menu if clicking outside
    if (navList?.classList.contains('active') && 
        !navList.contains(e.target) && 
        !mobileMenuBtn?.contains(e.target)) {
      navList.classList.remove('active');
      mobileMenuBtn?.classList.remove('active');
      mobileMenuBtn?.setAttribute('aria-expanded', 'false');
      body.style.overflow = '';
      
      const icon = mobileMenuBtn?.querySelector('i');
      if (icon) {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    }
  });

  // ==========================================
  // HANDLE WINDOW RESIZE
  // ==========================================
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      // Close mobile menu on desktop
      if (window.innerWidth > 1024) {
        navList?.classList.remove('active');
        mobileMenuBtn?.classList.remove('active');
        mobileMenuBtn?.setAttribute('aria-expanded', 'false');
        body.style.overflow = '';
        
        // Close all dropdowns
        dropdowns.forEach(dropdown => {
          dropdown.classList.remove('open');
          const link = dropdown.querySelector('.nav-link');
          if (link) {
            link.setAttribute('aria-expanded', 'false');
          }
        });
        
        const icon = mobileMenuBtn?.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
        }
      }
    }, 250);
  });

  // ==========================================
  // ACTIVE PAGE HIGHLIGHTING - FIXED VERSION
  // ==========================================
  function setActiveNav() {
    // Get current page filename
    let currentPage = window.location.pathname.split('/').pop();
    
    // If empty (root), set to index.html
    if (!currentPage || currentPage === '') {
      currentPage = 'index.html';
    }
    
    // Remove active class from all nav links
    const allNavLinks = document.querySelectorAll('.nav-link');
    allNavLinks.forEach(link => {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    });
    
    // Add active class to matching link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      
      // Direct match
      if (href === currentPage) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
      // Also check if current page is in dropdown and highlight Products
      else if (link.textContent.trim().includes('Products')) {
        const dropdownItems = link.parentElement?.querySelectorAll('.dropdown-item');
        dropdownItems?.forEach(item => {
          const itemHref = item.getAttribute('href');
          if (itemHref === currentPage) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
          }
        });
      }
    });
  }

  // Set active nav on page load
  setActiveNav();

  // ==========================================
  // CART & WISHLIST COUNTER
  // ==========================================
  function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    // Get from localStorage or your state management
    const count = localStorage.getItem('cartCount') || 0;
    
    if (cartCount) {
      if (count > 0) {
        cartCount.textContent = count;
        cartCount.style.display = 'flex';
      } else {
        cartCount.style.display = 'none';
      }
    }
  }

  function updateWishlistCount() {
    const wishlistCount = document.querySelector('.wishlist-count');
    // Get from localStorage or your state management
    const count = localStorage.getItem('wishlistCount') || 0;
    
    if (wishlistCount) {
      if (count > 0) {
        wishlistCount.textContent = count;
        wishlistCount.style.display = 'flex';
      } else {
        wishlistCount.style.display = 'none';
      }
    }
  }

  // Update counts on page load
  updateCartCount();
  updateWishlistCount();

  // Listen for storage changes (if you update counts from other pages)
  window.addEventListener('storage', function(e) {
    if (e.key === 'cartCount') {
      updateCartCount();
    }
    if (e.key === 'wishlistCount') {
      updateWishlistCount();
    }
  });

  // ==========================================
  // SMOOTH SCROLL FOR ANCHOR LINKS (optional)
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#' && href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const headerHeight = header?.offsetHeight || 100;
          const targetPosition = target.offsetTop - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

})();