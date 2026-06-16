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

    await expect(page).toHaveURL(/index\.html$/);
    await expect(page.locator('#login-message')).toHaveText(/login successful/i);
  });

  test('add to cart and checkout redirects to payment', async ({ page }) => {
    const indexPage = new IndexPage(page);
    await indexPage.goto();

    await indexPage.addFirstProductToCart();
    await expect(page.locator(indexPage.cartCount)).toHaveText('1');
    await expect(page.locator(indexPage.cartItems)).toHaveCount(1);

    await indexPage.checkout();
    await expect(page).toHaveURL(/payment\.html$/);
    await expect(page.locator('#payment-summary')).toBeVisible();
  });

  test('payment flow completes and clears cart', async ({ page }) => {
    const indexPage = new IndexPage(page);
    const paymentPage = new PaymentPage(page);

    await indexPage.goto();
    await indexPage.addFirstProductToCart();
    await expect(page.locator(indexPage.cartCount)).toHaveText('1');

    await paymentPage.goto();
    await paymentPage.submitPaymentForm(
      'Test Customer',
      '4111 1111 1111 1111',
      '12/25',
      '123',
      '123 Example Street'
    );

    await expect(page.locator('#payment-message')).toHaveText(/payment successful/i);
    const stored = await paymentPage.getStoredCart();
    expect(stored).toBe(null);
  });

  test('submit return request and verify history', async ({ page }) => {
    const returnPage = new ReturnPage(page);
    await returnPage.goto();

    await returnPage.submitReturnForm(
      'ORD-98765',
      'damaged',
      'Item arrived with broken handle'
    );

    await expect(page.locator('#return-message')).toHaveText(/submitted successfully/i);
    await expect(page.locator('.return-item')).toHaveCount(1);

    const returns = await returnPage.getStoredReturns();
    expect(returns.length).toBe(1);
    expect(returns[0].orderId).toBe('ORD-98765');
    expect(returns[0].reason).toBe('damaged');
    expect(returns[0].status).toBe('pending');
  });

  test('submit multiple return requests', async ({ page }) => {
    const returnPage = new ReturnPage(page);
    await returnPage.goto();

    await returnPage.submitReturnForm('ORD-11111', 'defective');
    await returnPage.submitReturnForm('ORD-22222', 'wrong_item', 'Received wrong size');

    await expect(page.locator('.return-item')).toHaveCount(2);

    const returns = await returnPage.getStoredReturns();
    expect(returns.length).toBe(2);
    expect(returns[0].orderId).toBe('ORD-11111');
    expect(returns[1].orderId).toBe('ORD-22222');
  });
});
