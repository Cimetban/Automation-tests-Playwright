const paymentForm = document.getElementById('payment-form');
const paymentMessage = document.getElementById('payment-message');
const paymentSummary = document.getElementById('payment-summary');
const submitPayment = document.getElementById('submit-payment');

const CART_KEY = 'shopEaseCart';

function formatCurrency(value) {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
}

function getCartItems() {
  return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
}

function renderSummary() {
  const cartItems = getCartItems();
  paymentSummary.innerHTML = '';

  if (cartItems.length === 0) {
    paymentSummary.innerHTML = '<p class="empty-message">Your cart is empty. Add items on the homepage first.</p>';
    submitPayment.disabled = true;
    return;
  }

  let total = 0;

  cartItems.forEach((item) => {
    const amount = item.product.price * item.quantity;
    total += amount;

    const row = document.createElement('div');
    row.className = 'payment-item';
    row.innerHTML = `
      <span>${item.product.name} × ${item.quantity}</span>
      <strong>${formatCurrency(amount)}</strong>
    `;
    paymentSummary.appendChild(row);
  });

  const totalRow = document.createElement('div');
  totalRow.className = 'payment-total';
  totalRow.innerHTML = `
    <span>Order total</span>
    <strong>${formatCurrency(total)}</strong>
  `;
  paymentSummary.appendChild(totalRow);
}

paymentForm.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!paymentForm.checkValidity()) {
    paymentMessage.textContent = 'Please complete all required fields correctly.';
    paymentMessage.className = 'form-message error';
    return;
  }

  const cvv = paymentForm.cvv.value.trim();
  const cardNumber = paymentForm.cardNumber.value.replace(/\s+/g, '');
  const expiryDate = paymentForm.expiryDate.value.trim();

  if (cardNumber.length < 12 || cardNumber.length > 19) {
    paymentMessage.textContent = 'Enter a valid card number.';
    paymentMessage.className = 'form-message error';
    return;
  }

  if (!/^\d{2}\/\s?\d{2}$/.test(expiryDate)) {
    paymentMessage.textContent = 'Enter expiry date in MM / YY format.';
    paymentMessage.className = 'form-message error';
    return;
  }

  if (!/^\d{3,4}$/.test(cvv)) {
    paymentMessage.textContent = 'Enter a valid CVV.';
    paymentMessage.className = 'form-message error';
    return;
  }

  localStorage.removeItem(CART_KEY);
  paymentMessage.textContent = 'Payment successful! Thank you for your purchase.';
  paymentMessage.className = 'form-message success';
  submitPayment.disabled = true;

  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1500);
});

renderSummary();
