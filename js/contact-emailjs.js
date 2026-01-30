// contact-emailjs.js - Alternative email handling using EmailJS
// No PHP required! Works on any hosting including GitHub Pages

// =========================
// EMAILJS CONFIGURATION
// =========================

// Get your credentials from: https://www.emailjs.com/
const EMAILJS_CONFIG = {
  serviceID: 'YOUR_SERVICE_ID',      // Replace with your EmailJS Service ID
  templateID: 'YOUR_TEMPLATE_ID',    // Replace with your EmailJS Template ID
  publicKey: 'YOUR_PUBLIC_KEY'       // Replace with your EmailJS Public Key
};

// Initialize EmailJS
(function() {
  emailjs.init(EMAILJS_CONFIG.publicKey);
})();

// =========================
// FORM HANDLING
// =========================

document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('mainContactForm');
  
  // Handle product inquiry from URL
  handleProductInquiry();

  // Form submission
  if (contactForm) {
    contactForm.addEventListener('submit', handleFormSubmitEmailJS);
  }
});

/**
 * Handle product inquiry from URL parameters
 */
function handleProductInquiry() {
  const urlParams = new URLSearchParams(window.location.search);
  const products = urlParams.get('products') || urlParams.get('product');

  if (products) {
    // Set the hidden field
    const hiddenField = document.getElementById('cart-items-hidden');
    if (hiddenField) {
      hiddenField.value = products;
    }

    // Show notice
    const notice = document.getElementById('cart-notice');
    const display = document.getElementById('selected-products-display');
    if (notice && display) {
      notice.style.display = 'block';
      display.textContent = products;
    }

    // Auto-fill subject
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
 * Handle form submission with EmailJS
 */
function handleFormSubmitEmailJS(e) {
  e.preventDefault();

  const form = e.target;
  const submitButton = form.querySelector('button[type="submit"]');
  const formMessage = document.getElementById('form-message');

  // Validate form
  if (!validateForm(form)) {
    showMessage('error', 'Please fill in all required fields correctly.');
    return;
  }

  // Disable submit button
  submitButton.disabled = true;
  submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

  // Prepare template parameters
  const templateParams = {
    from_name: form.name.value,
    from_email: form.email.value,
    phone: form.phone.value || 'Not provided',
    subject: form.subject.value,
    message: form.message.value,
    cart_items: form.cart_items.value || 'None',
    to_email: 'info@sherazimpex.com', // Your email
    reply_to: form.email.value
  };

  // Send email via EmailJS
  emailjs.send(
    EMAILJS_CONFIG.serviceID,
    EMAILJS_CONFIG.templateID,
    templateParams
  )
  .then(
    function(response) {
      console.log('SUCCESS!', response.status, response.text);
      
      // Show success message
      showMessage('success', 'Thank you! Your message has been sent successfully. We\'ll get back to you soon.');
      
      // Reset form
      form.reset();
      
      // Hide cart notice
      const cartNotice = document.getElementById('cart-notice');
      if (cartNotice) {
        cartNotice.style.display = 'none';
      }

      // Re-enable button
      submitButton.disabled = false;
      submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    },
    function(error) {
      console.log('FAILED...', error);
      
      // Show error message
      showMessage('error', 'Oops! Something went wrong. Please try again or contact us directly at info@sherazimpex.com');
      
      // Re-enable button
      submitButton.disabled = false;
      submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    }
  );
}

/**
 * Validate form fields
 */
function validateForm(form) {
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const subject = form.subject.value.trim();
  const message = form.message.value.trim();

  // Check required fields
  if (!name || name.length < 2) {
    return false;
  }

  if (!email || !isValidEmail(email)) {
    return false;
  }

  if (!subject || subject.length < 3) {
    return false;
  }

  if (!message || message.length < 10) {
    return false;
  }

  return true;
}

/**
 * Validate email format
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Display form message
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