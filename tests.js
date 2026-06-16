const testResults = document.getElementById('test-results');
const frameLogin = document.getElementById('frame-login');
const frameIndex = document.getElementById('frame-index');
const framePayment = document.getElementById('frame-payment');

const results = [];

function addResult(name, passed, message) {
  results.push({ name, passed, message });
}

function renderResults() {
  testResults.innerHTML = results
    .map((result) => `
      <div class="test-result ${result.passed ? 'success' : 'error'}">
        <h3>${result.name}</h3>
        <p>${result.message}</p>
      </div>
    `)
    .join('');
}

function waitForIframeLoad(frame) {
  return new Promise((resolve) => {
    if (frame.contentDocument && frame.contentDocument.readyState === 'complete') {
      resolve();
      return;
    }
    frame.addEventListener('load', () => resolve(), { once: true });
  });
}

async function runLoginTests() {
  const frame = frameLogin.contentWindow;
  const form = frame.document.getElementById('login-form');
  const email = form.email;
  const password = form.password;
  const message = frame.document.getElementById('login-message');

  email.value = 'user@example.com';
  password.value = 'password123';
  form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

  await new Promise((resolve) => setTimeout(resolve, 1200));
  const success = message.textContent.includes('Login successful');
  addResult('TC-LOGIN-01: Successful login', success, success ? 'Passed' : 'Failed');
  runCartTests();
}

async function runCartTests() {
  const frame = frameIndex.contentWindow;
  const firstCardButton = frame.document.querySelector('.add-to-cart');

  if (!firstCardButton) {
    addResult('TC-CART-01: Add single product', false, 'Add to cart button not found');
    runPaymentTests();
    return;
  }

  firstCardButton.click();
  await new Promise((resolve) => setTimeout(resolve, 800));

  const cartCount = frame.document.getElementById('cart-count').textContent;
  const cartItems = frame.document.querySelectorAll('.cart-item').length;
  const success = cartCount === '1' && cartItems === 1;
  addResult('TC-CART-01: Add single product', success, success ? 'Passed' : 'Cart count or items incorrect');

  const checkoutButton = frame.document.getElementById('checkout-button');
  checkoutButton.click();

  await waitForIframeLoad(frameIndex);

  const redirected = frame.document.location.href.includes('payment.html');
  addResult('TC-PAY-01: Checkout redirects to payment', redirected, redirected ? 'Passed' : 'Checkout did not redirect to payment page');
  runPaymentTests();
}

async function runPaymentTests() {
  const frame = frameIndex.contentWindow;
  const form = frame.document.getElementById('payment-form');
  const fields = {
    fullName: 'Test Customer',
    cardNumber: '4111 1111 1111 1111',
    expiryDate: '12 / 25',
    cvv: '123',
    billingAddress: '123 Example Saint',
  };

  Object.keys(fields).forEach((key) => {
    frame.document.getElementById(key).value = fields[key];
  });

  form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

  await new Promise((resolve) => setTimeout(resolve, 1200));
  const message = frame.document.getElementById('payment-message').textContent;
  const success = message.includes('Payment successful');
  addResult('TC-PAY-01: Successful checkout payment', success, success ? 'Passed' : 'Payment submission failed');
  renderResults();
}

async function startTests() {
  await Promise.all([
    waitForIframeLoad(frameLogin),
    waitForIframeLoad(frameIndex),
  ]);
  runLoginTests();
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  startTests();
} else {
  window.addEventListener('load', startTests);
}
