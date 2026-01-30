// Contact Form Handling
document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('mainContactForm');
  const formMessage = document.getElementById('form-message');

  // Check for cart products or single product in URL
  handleProductInquiry();

  // Form submission
  if (contactForm) {
    contactForm.addEventListener('submit', handleFormSubmit);
  }
});

/**
 * Handle product inquiry from URL parameters
 * Supports both 'products' (from cart) and 'product' (from detail page)
 */
function handleProductInquiry() {
  const urlParams = new URLSearchParams(window.location.search);
  const products = urlParams.get('products') || urlParams.get('product');

  if (products) {
    // Set the hidden field for PHP
    const hiddenField = document.getElementById('cart-items-hidden');
    if (hiddenField) {
      hiddenField.value = products;
    }

    // Show the user a notice that items are included
    const notice = document.getElementById('cart-notice');
    const display = document.getElementById('selected-products-display');
    if (notice && display) {
      notice.style.display = 'block';
      display.textContent = products;
    }

    // Auto-fill subject if it's empty
    const subjectField = document.getElementById('subject');
    if (subjectField && !subjectField.value) {
      subjectField.value = urlParams.has('products')
        ? "Wholesale Quote Request for Selected Items"
        : `Inquiry for ${products}`;
    }

    // Set message hint
    const messageField = document.getElementById('message');
    if (messageField) {
      messageField.placeholder = "Please provide your company details and quantity requirements for the product(s) listed above...";
    }
  }
}

/**
 * Handle form submission
 * @param {Event} e - Submit event
 */
async function handleFormSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const submitButton = form.querySelector('button[type="submit"]');
  const formMessage = document.getElementById('form-message');

  // Disable submit button
  submitButton.disabled = true;
  submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

  try {
    // Get form data
    const formData = new FormData(form);

    // Send to PHP backend
    const response = await fetch(form.action, {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    if (result.success) {
      // Show success message
      showMessage('success', result.message || 'Thank you! Your message has been sent successfully. We\'ll get back to you soon.');
      
      // Reset form
      form.reset();
      
      // Hide cart notice if visible
      const cartNotice = document.getElementById('cart-notice');
      if (cartNotice) {
        cartNotice.style.display = 'none';
      }

      // Optional: Redirect after 3 seconds
      // setTimeout(() => {
      //   window.location.href = 'index.html';
      // }, 3000);
    } else {
      // Show error message
      showMessage('error', result.message || 'Oops! Something went wrong. Please try again.');
    }
  } catch (error) {
    console.error('Form submission error:', error);
    showMessage('error', 'Network error. Please check your connection and try again.');
  } finally {
    // Re-enable submit button
    submitButton.disabled = false;
    submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
  }
}

/**
 * Display form message
 * @param {string} type - 'success' or 'error'
 * @param {string} message - Message to display
 */
function showMessage(type, message) {
  const formMessage = document.getElementById('form-message');
  if (!formMessage) return;

  formMessage.className = `form-message ${type}`;
  formMessage.textContent = message;
  formMessage.style.display = 'block';

  // Scroll to message
  formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  // Hide after 5 seconds
  setTimeout(() => {
    formMessage.style.display = 'none';
  }, 5000);
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean}
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number (optional but if provided should be valid)
 * @param {string} phone - Phone to validate
 * @returns {boolean}
 */
function isValidPhone(phone) {
  if (!phone) return true; // Phone is optional
  const phoneRegex = /^[\d\s+()-]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}