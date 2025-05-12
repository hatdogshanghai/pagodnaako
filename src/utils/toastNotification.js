/**
 * Toast Notification Utility
 * 
 * This utility provides functions to show toast notifications when products are added to cart
 * or other actions are performed.
 */

/**
 * Show a toast notification
 * @param {string} title - The notification title
 * @param {string} message - The notification message
 * @param {string} icon - The icon class (Boxicons)
 * @param {string} type - The type of toast (cart, success, error, etc.)
 * @param {number} duration - How long to show the toast in milliseconds
 */
export function showToast(title, message, icon = 'bx-cart-add', type = 'cart', duration = 3000) {
  // Create toast container if it doesn't exist
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  // Create toast element
  const toast = document.createElement('div');
  toast.className = `toast ${type}-toast`;

  // Set toast content
  toast.innerHTML = `
    <div class="toast-header">
      <i class='bx ${icon}'></i>
      <span class="toast-title">${title}</span>
      <button class="toast-close">&times;</button>
    </div>
    <div class="toast-body">
      ${message}
    </div>
  `;

  // Add toast to container
  toastContainer.appendChild(toast);

  // Add event listener to close button
  const closeButton = toast.querySelector('.toast-close');
  closeButton.addEventListener('click', () => {
    toast.classList.add('toast-hiding');
    setTimeout(() => {
      toast.remove();
    }, 300);
  });

  // Show the toast
  setTimeout(() => {
    toast.classList.add('toast-visible');
  }, 10);

  // Auto-hide the toast after specified duration
  setTimeout(() => {
    toast.classList.add('toast-hiding');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, duration);
}

/**
 * Show a cart notification when a product is added to cart
 * @param {string} productName - The name of the product added to cart
 */
export function showCartNotification(productName) {
  showToast(
    'Added to Cart',
    `${productName} has been added to your cart.`,
    'bx-cart-add',
    'cart',
    3000
  );
}

/**
 * Show a success notification
 * @param {string} title - The notification title
 * @param {string} message - The notification message
 */
export function showSuccessNotification(title, message) {
  showToast(
    title,
    message,
    'bx-check',
    'success',
    3000
  );
}

/**
 * Show an error notification
 * @param {string} title - The notification title
 * @param {string} message - The notification message
 */
export function showErrorNotification(title, message) {
  showToast(
    title,
    message,
    'bx-error',
    'error',
    5000
  );
}
