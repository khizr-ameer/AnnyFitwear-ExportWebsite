// Cart Management System
// Handles adding, removing, and managing cart items

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', () => {
  loadCart();
  updateCartDisplay();
  
  // Event listeners
  document.getElementById('clear-cart')?.addEventListener('click', clearCart);
  document.getElementById('request-quote-btn')?.addEventListener('click', requestQuote);
});

/**
 * Get cart from localStorage
 */
function getCart() {
  const cart = localStorage.getItem('annyfitwear_cart');
  return cart ? JSON.parse(cart) : [];
}

/**
 * Save cart to localStorage
 */
function saveCart(cart) {
  localStorage.setItem('annyfitwear_cart', JSON.stringify(cart));
  updateCartCount();
}

/**
 * Update cart count in header (if exists)
 */
function updateCartCount() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  // Update all cart count elements
  const cartCountElements = document.querySelectorAll('.cart-count');
  cartCountElements.forEach(el => {
    el.textContent = totalItems;
    el.style.display = totalItems > 0 ? 'flex' : 'none';
  });
}

/**
 * Add item to cart
 */
function addToCart(product) {
  const cart = getCart();
  
  // Check if product already exists
  const existingIndex = cart.findIndex(item => item.id === product.id);
  
  if (existingIndex > -1) {
    // Update quantity
    cart[existingIndex].quantity += 1;
  } else {
    // Add new product
    cart.push({
      id: product.id,
      name: product.name,
      description: product.description,
      image: product.image,
      category: product.category,
      quantity: 1,
      addedAt: new Date().toISOString()
    });
  }
  
  saveCart(cart);
  showNotification('Product added to cart!');
  return true;
}

/**
 * Remove item from cart
 */
function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);
  updateCartDisplay();
  showNotification('Product removed from cart');
}

/**
 * Update item quantity
 */
function updateQuantity(productId, change) {
  const cart = getCart();
  const itemIndex = cart.findIndex(item => item.id === productId);
  
  if (itemIndex > -1) {
    cart[itemIndex].quantity += change;
    
    // Remove if quantity becomes 0
    if (cart[itemIndex].quantity <= 0) {
      cart.splice(itemIndex, 1);
    }
    
    saveCart(cart);
    updateCartDisplay();
  }
}

/**
 * Clear entire cart
 */
function clearCart() {
  if (confirm('Are you sure you want to clear your cart?')) {
    localStorage.removeItem('annyfitwear_cart');
    updateCartDisplay();
    showNotification('Cart cleared');
  }
}

/**
 * Load and display cart items
 */
function loadCart() {
  const cart = getCart();
  const cartItemsContainer = document.getElementById('cart-items');
  const emptyCart = document.getElementById('empty-cart');
  const cartContent = document.getElementById('cart-content');
  
  if (!cartItemsContainer) return;
  
  // Show/hide empty state
  if (cart.length === 0) {
    if (emptyCart) emptyCart.style.display = 'block';
    if (cartContent) cartContent.style.display = 'none';
    return;
  }
  
  if (emptyCart) emptyCart.style.display = 'none';
  if (cartContent) cartContent.style.display = 'block';
  
  // Render cart items
  cartItemsContainer.innerHTML = cart.map(item => `
    <div class="cart-item" data-product-id="${item.id}">
      <div class="item-image">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="item-details">
        <h3 class="item-name">${item.name}</h3>
        <p class="item-description">${item.description}</p>
        <div class="item-meta">
          <span class="meta-item">
            <i class="fas fa-tag"></i>
            ${item.category || 'Motorbike Gear'}
          </span>
          <span class="meta-item">
            <i class="fas fa-clock"></i>
            Added ${formatDate(item.addedAt)}
          </span>
        </div>
      </div>
      <div class="item-actions">
        <div class="item-quantity">
          <button class="qty-btn" onclick="updateQuantity('${item.id}', -1)">
            <i class="fas fa-minus"></i>
          </button>
          <span class="qty-value">${item.quantity}</span>
          <button class="qty-btn" onclick="updateQuantity('${item.id}', 1)">
            <i class="fas fa-plus"></i>
          </button>
        </div>
        <button class="btn-remove-item" onclick="removeFromCart('${item.id}')">
          <i class="fas fa-trash-alt"></i>
          Remove
        </button>
      </div>
    </div>
  `).join('');
  
  // Update summary
  updateCartSummary(cart);
}

/**
 * Update cart display
 */
function updateCartDisplay() {
  loadCart();
  updateCartCount();
}

/**
 * Update cart summary
 */
function updateCartSummary(cart) {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  const totalItemsEl = document.getElementById('total-items');
  if (totalItemsEl) {
    totalItemsEl.textContent = totalItems;
  }
}

/**
 * Request quote - redirect to contact page with cart items
 */
function requestQuote() {
  const cart = getCart();
  
  if (cart.length === 0) {
    alert('Your cart is empty. Please add products before requesting a quote.');
    return;
  }
  
  // Create product list
  const productList = cart.map(item => `${item.name} (Qty: ${item.quantity})`).join(', ');
  
  // Redirect to contact page with products
  window.location.href = `contact.html?products=${encodeURIComponent(productList)}`;
}

/**
 * Format date to relative time
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString();
}

/**
 * Show notification
 */
function showNotification(message) {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.innerHTML = `
    <i class="fas fa-check-circle"></i>
    <span>${message}</span>
  `;
  
  // Add to body
  document.body.appendChild(notification);
  
  // Show notification
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  // Hide and remove after 3 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

// Add notification styles if not already present
if (!document.querySelector('#notification-styles')) {
  const style = document.createElement('style');
  style.id = 'notification-styles';
  style.textContent = `
    .notification {
      position: fixed;
      top: 100px;
      right: 20px;
      display: flex;
      align-items: center;
      gap: 0.8rem;
      padding: 1rem 1.5rem;
      background: rgba(212, 175, 55, 0.95);
      color: #000;
      border-radius: 10px;
      font-weight: 600;
      font-size: 0.95rem;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      transform: translateX(400px);
      opacity: 0;
      transition: all 0.3s ease;
      z-index: 10000;
    }
    
    .notification.show {
      transform: translateX(0);
      opacity: 1;
    }
    
    .notification i {
      font-size: 1.2rem;
    }
    
    @media (max-width: 768px) {
      .notification {
        right: 10px;
        left: 10px;
        top: 80px;
      }
    }
  `;
  document.head.appendChild(style);
}

// Export functions for use in other scripts
window.cartFunctions = {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  getCart,
  updateCartCount
};