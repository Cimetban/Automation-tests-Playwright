const LoginPage = require('./pages/LoginPage');
const IndexPage = require('./pages/IndexPage');
const PaymentPage = require('./pages/PaymentPage');
const ReturnPage = require('./pages/ReturnPage');
const { test, expect } = require('@playwright/test');

test.describe('ShopEase E2E with Page Object Model', () => {
  test('login flow', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('user@example.com', 'password123');
    expect(page.url()).toContain('index.html');
  });

  test('add to cart and checkout redirects to payment', async ({ page }) => {
    const indexPage = new IndexPage(page);
    await indexPage.goto();

    // Add product to cart
    await indexPage.addFirstProductToCart();
    await page.waitForTimeout(500);

    // Verify cart updated
    const cartCount = await indexPage.getCartCount();
    expect(cartCount.trim()).toBe('1');

    const cartItemsCount = await indexPage.getCartItemsCount();
    expect(cartItemsCount).toBe(1);

    // Checkout and verify redirect
    await indexPage.checkout();
    expect(page.url()).toContain('payment.html');
  });

  test('payment flow completes and clears cart', async ({ page }) => {
    const indexPage = new IndexPage(page);
    const paymentPage = new PaymentPage(page);

    // Prepare cart
    await indexPage.goto();
    await indexPage.addFirstProductToCart();
    await page.waitForTimeout(300);

    // Go to payment and submit
    await paymentPage.goto();
    await paymentPage.submitPaymentForm(
      'Test Customer',
      '4111 1111 1111 1111',
      '12/25',
      '123',
      '123 Example Saint'
    );

    // Verify payment success
    const msg = await paymentPage.getPaymentMessage();
    expect(msg).toContain('Payment successful');

    // Verify cart cleared
    const stored = await paymentPage.getStoredCart();
    expect(stored).toBe(null);
  });

  test('submit return request and verify history', async ({ page }) => {
    const returnPage = new ReturnPage(page);
    await returnPage.goto();

    // Submit return request
    await returnPage.submitReturnForm(
      'ORD-98765',
      'damaged',
      'Item arrived with broken handle'
    );

    // Verify success message
    const msg = await returnPage.getReturnMessage();
    expect(msg).toContain('submitted successfully');

    // Verify return appears in history
    const historyCount = await returnPage.getReturnHistoryCount();
    expect(historyCount).toBe(1);

    // Verify return data persisted
    const returns = await returnPage.getStoredReturns();
    expect(returns.length).toBe(1);
    expect(returns[0].orderId).toBe('ORD-98765');
    expect(returns[0].reason).toBe('damaged');
    expect(returns[0].status).toBe('pending');
  });

  test('submit multiple return requests', async ({ page }) => {
    const returnPage = new ReturnPage(page);
    await returnPage.goto();

    // Submit first return
    await returnPage.submitReturnForm('ORD-11111', 'defective');
    await page.waitForTimeout(300);

    // Submit second return
    await returnPage.submitReturnForm('ORD-22222', 'wrong_item', 'Received wrong size');
    await page.waitForTimeout(300);

    // Verify both in history
    const historyCount = await returnPage.getReturnHistoryCount();
    expect(historyCount).toBe(2);

    const returns = await returnPage.getStoredReturns();
    expect(returns.length).toBe(2);
    expect(returns[0].orderId).toBe('ORD-11111');
    expect(returns[1].orderId).toBe('ORD-22222');
  });
});
