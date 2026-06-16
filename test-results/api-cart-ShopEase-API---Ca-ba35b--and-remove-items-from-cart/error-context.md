# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api\cart.spec.js >> ShopEase API - Cart >> should add, update, and remove items from cart
- Location: tests\api\cart.spec.js:5:3

# Error details

```
TypeError: request.newContext is not a function
```

# Test source

```ts
  1  | const { expect } = require('@playwright/test');
  2  | 
  3  | const baseURL = 'http://127.0.0.1:3000';
  4  | 
  5  | async function createAuthenticatedApiContext(request) {
> 6  |   const loginContext = await request.newContext({ baseURL });
     |                                      ^ TypeError: request.newContext is not a function
  7  |   const loginResponse = await loginContext.post('/api/login', {
  8  |     data: { email: 'user@example.com', password: 'password123' },
  9  |   });
  10 | 
  11 |   expect(loginResponse.ok()).toBeTruthy();
  12 |   const sessionToken = loginResponse.headers()['x-session-token'];
  13 |   expect(sessionToken).toBeTruthy();
  14 | 
  15 |   await loginContext.dispose();
  16 | 
  17 |   return await request.newContext({
  18 |     baseURL,
  19 |     extraHTTPHeaders: {
  20 |       Authorization: `Bearer ${sessionToken}`,
  21 |     },
  22 |   });
  23 | }
  24 | 
  25 | module.exports = {
  26 |   baseURL,
  27 |   createAuthenticatedApiContext,
  28 | };
  29 | 
```