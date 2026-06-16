const { test, expect } = require('@playwright/test');
const { createAuthenticatedApiContext } = require('./api-helpers');

test.describe('ShopEase API - Cart', () => {
  test('should add, update, and remove items from cart', async ({ request }) => {
    const apiContext = await createAuthenticatedApiContext(request);

    const addResponse = await apiContext.post('/api/cart/add', { data: { productId: 1, quantity: 2 } });
    expect(addResponse.ok()).toBeTruthy();
    const addBody = await addResponse.json();
    expect(addBody.cart).toHaveLength(1);
    expect(addBody.cart[0].quantity).toBe(2);
    expect(addBody.cart[0].product).toMatchObject({ id: 1 });

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
});
