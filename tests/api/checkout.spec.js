const { test, expect } = require('@playwright/test');
const { createAuthenticatedApiContext } = require('./api-helpers');

test.describe('ShopEase API - Checkout', () => {
  test('should complete checkout and clear the cart', async ({ request }) => {
    const apiContext = await createAuthenticatedApiContext(request);

    await apiContext.post('/api/cart/add', { data: { productId: 2, quantity: 1 } });
    const cartBefore = await apiContext.get('/api/cart');
    expect((await cartBefore.json()).cart).toHaveLength(1);

    const response = await apiContext.post('/api/checkout', {
      data: {
        fullName: 'Test Customer',
        cardNumber: '4111111111111111',
        expiryDate: '12/25',
        cvv: '123',
        billingAddress: '123 Example Street',
      },
    });

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.success).toBe(true);

    const cartAfter = await apiContext.get('/api/cart');
    expect((await cartAfter.json()).cart).toHaveLength(0);

    await apiContext.dispose();
  });
});
