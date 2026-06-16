const { test, expect } = require('@playwright/test');
const { baseURL } = require('./api-helpers');

test.describe('ShopEase API - Products', () => {
  test('products endpoint returns a product list', async ({ request }) => {
    const response = await request.get(`${baseURL}/api/products`);

    expect(response.ok()).toBeTruthy();
    const products = await response.json();

    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
    expect(products[0]).toMatchObject({
      id: expect.any(Number),
      name: expect.any(String),
      price: expect.any(Number),
      image: expect.any(String),
    });
  });
});
