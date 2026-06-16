const { test, expect } = require('@playwright/test');
const { baseURL } = require('./api-helpers');

test.describe('ShopEase API - Login', () => {
  test('login should authenticate with valid credentials', async ({ request }) => {
    const response = await request.post(`${baseURL}/api/login`, {
      data: { email: 'user@example.com', password: 'password123' },
    });

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.user).toMatchObject({ email: 'user@example.com' });
    expect(response.headers()['x-session-token']).toBeTruthy();
  });
});
