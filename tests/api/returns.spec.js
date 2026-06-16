const { test, expect } = require('@playwright/test');
const { createAuthenticatedApiContext } = require('./api-helpers');

test.describe('ShopEase API - Returns', () => {
  test('should submit and remove return requests', async ({ request }) => {
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
