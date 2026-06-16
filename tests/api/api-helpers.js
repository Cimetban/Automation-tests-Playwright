const { expect } = require('@playwright/test');

const baseURL = 'http://127.0.0.1:3000';

async function createAuthenticatedApiContext(request) {
  const loginContext = await request.newContext({ baseURL });
  const loginResponse = await loginContext.post('/api/login', {
    data: { email: 'user@example.com', password: 'password123' },
  });

  expect(loginResponse.ok()).toBeTruthy();
  const sessionToken = loginResponse.headers()['x-session-token'];
  expect(sessionToken).toBeTruthy();

  await loginContext.dispose();

  return await request.newContext({
    baseURL,
    extraHTTPHeaders: {
      Authorization: `Bearer ${sessionToken}`,
    },
  });
}

module.exports = {
  baseURL,
  createAuthenticatedApiContext,
};
