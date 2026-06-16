const { test, expect } = require('@playwright/test');

const baseURL = 'http://127.0.0.1:3000';

async function createAuthenticatedApiContext(request) {
  const sessionContext = await request.newContext({ baseURL });
  const loginResponse = await sessionContext.post('/api/login', {
    data: { email: 'user@example.com', password: 'password123' },
  });

  expect(loginResponse.ok()).toBeTruthy();
  const sessionToken = loginResponse.headers()['x-session-token'];
  expect(sessionToken).toBeTruthy();

  await sessionContext.dispose();

  return await request.newContext({
    baseURL,
    extraHTTPHeaders: {
      Authorization: `Bearer ${sessionToken}`,
    },
  });
}

test.describe('ShopEase API tests', () => {
  test('login endpoint should authenticate and return a session token', async ({ request }) => {
    const response = await request.post(`${baseURL}/api/login`, {
      data: { email: 'user@example.com', password: 'password123' },
    });

    expect(response.ok()).toBeTruthy();
    const responseBody = await response.json();
    expect(responseBody.success).toBe(true);
    expect(responseBody.user).toMatchObject({ email: 'user@example.com' });
    expect(response.headers()['x-session-token']).toBeTruthy();
  });

  test('products endpoint should return product list', async ({ request }) => {
    const response = await request.get(`${baseURL}/api/products`);
    expect(response.ok()).toBeTruthy();

    const products = await response.json();
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
    expect(products[0]).toMatchObject({ id: expect.any(Number), name: expect.any(String), price: expect.any(Number) });
  });

  test('cart endpoint should allow adding, updating, and removing items', async ({ request }) => {
    const apiContext = await createAuthenticatedApiContext(request);

    const addResponse = await apiContext.post('/api/cart/add', { data: { productId: 1, quantity: 2 } });
    expect(addResponse.ok()).toBeTruthy();
    const addBody = await addResponse.json();
    expect(addBody.cart).toHaveLength(1);
    expect(addBody.cart[0]).toMatchObject({ quantity: 2, product: expect.objectContaining({ id: 1 }) });

    const updateResponse = await apiContext.post('/api/cart/update', { data: { productId: 1, quantity: 1 } });
    expect(updateResponse.ok()).toBeTruthy();
    const updateBody = await updateResponse.json();
    expect(updateBody.cart[0].quantity).toBe(1);

    const removeResponse = await apiContext.post('/api/cart/update', { data: { productId: 1, quantity: 0 } });
    expect(removeResponse.ok()).toBeTruthy();
    const removeBody = await removeResponse.json();
    expect(removeBody.cart).toHaveLength(0);

    await apiContext.dispose();
  });

  test('checkout endpoint should clear cart after successful payment', async ({ request }) => {
    const apiContext = await createAuthenticatedApiContext(request);

    await apiContext.post('/api/cart/add', { data: { productId: 2, quantity: 1 } });
    const cartBefore = await apiContext.get('/api/cart');
    expect((await cartBefore.json()).cart).toHaveLength(1);

    const checkoutResponse = await apiContext.post('/api/checkout', {
      data: {
        fullName: 'Test Customer',
        cardNumber: '4111111111111111',
        expiryDate: '12/25',
        cvv: '123',
        billingAddress: '123 Example Street',
      },
    });

    expect(checkoutResponse.ok()).toBeTruthy();
    const checkoutBody = await checkoutResponse.json();
    expect(checkoutBody.success).toBe(true);

    const cartAfter = await apiContext.get('/api/cart');
    expect((await cartAfter.json()).cart).toHaveLength(0);

    await apiContext.dispose();
  });

  test('returns endpoint should allow submitting and removing return requests', async ({ request }) => {
    const apiContext = await createAuthenticatedApiContext(request);

    const returnsBefore = await apiContext.get('/api/returns');
    expect((await returnsBefore.json()).returns).toEqual([]);

    const submitResponse = await apiContext.post('/api/returns', {
      data: { orderId: 'ORD-10001', reason: 'damaged', comments: 'Broken on arrival' },
    });
    expect(submitResponse.ok()).toBeTruthy();

    const submitBody = await submitResponse.json();
    expect(submitBody.returns).toHaveLength(1);
    expect(submitBody.returns[0]).toMatchObject({ orderId: 'ORD-10001', reason: 'damaged' });

    const removeResponse = await apiContext.post('/api/returns/remove', {
      data: { orderId: 'ORD-10001' },
    });
    expect(removeResponse.ok()).toBeTruthy();
    expect((await removeResponse.json()).returns).toHaveLength(0);

    await apiContext.dispose();
  });
});
