# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api.spec.js >> ShopEase API tests >> cart endpoint should allow adding, updating, and removing items
- Location: tests\api.spec.js:48:3

# Error details

```
TypeError: request.newContext is not a function
```

# Test source

```ts
  1   | const { test, expect } = require('@playwright/test');
  2   | 
  3   | const baseURL = 'http://127.0.0.1:3000';
  4   | 
  5   | async function createAuthenticatedApiContext(request) {
> 6   |   const sessionContext = await request.newContext({ baseURL });
      |                                        ^ TypeError: request.newContext is not a function
  7   |   const loginResponse = await sessionContext.post('/api/login', {
  8   |     data: { email: 'user@example.com', password: 'password123' },
  9   |   });
  10  | 
  11  |   expect(loginResponse.ok()).toBeTruthy();
  12  |   const sessionToken = loginResponse.headers()['x-session-token'];
  13  |   expect(sessionToken).toBeTruthy();
  14  | 
  15  |   await sessionContext.dispose();
  16  | 
  17  |   return await request.newContext({
  18  |     baseURL,
  19  |     extraHTTPHeaders: {
  20  |       Authorization: `Bearer ${sessionToken}`,
  21  |     },
  22  |   });
  23  | }
  24  | 
  25  | test.describe('ShopEase API tests', () => {
  26  |   test('login endpoint should authenticate and return a session token', async ({ request }) => {
  27  |     const response = await request.post(`${baseURL}/api/login`, {
  28  |       data: { email: 'user@example.com', password: 'password123' },
  29  |     });
  30  | 
  31  |     expect(response.ok()).toBeTruthy();
  32  |     const responseBody = await response.json();
  33  |     expect(responseBody.success).toBe(true);
  34  |     expect(responseBody.user).toMatchObject({ email: 'user@example.com' });
  35  |     expect(response.headers()['x-session-token']).toBeTruthy();
  36  |   });
  37  | 
  38  |   test('products endpoint should return product list', async ({ request }) => {
  39  |     const response = await request.get(`${baseURL}/api/products`);
  40  |     expect(response.ok()).toBeTruthy();
  41  | 
  42  |     const products = await response.json();
  43  |     expect(Array.isArray(products)).toBe(true);
  44  |     expect(products.length).toBeGreaterThan(0);
  45  |     expect(products[0]).toMatchObject({ id: expect.any(Number), name: expect.any(String), price: expect.any(Number) });
  46  |   });
  47  | 
  48  |   test('cart endpoint should allow adding, updating, and removing items', async ({ request }) => {
  49  |     const apiContext = await createAuthenticatedApiContext(request);
  50  | 
  51  |     const addResponse = await apiContext.post('/api/cart/add', { data: { productId: 1, quantity: 2 } });
  52  |     expect(addResponse.ok()).toBeTruthy();
  53  |     const addBody = await addResponse.json();
  54  |     expect(addBody.cart).toHaveLength(1);
  55  |     expect(addBody.cart[0]).toMatchObject({ quantity: 2, product: expect.objectContaining({ id: 1 }) });
  56  | 
  57  |     const updateResponse = await apiContext.post('/api/cart/update', { data: { productId: 1, quantity: 1 } });
  58  |     expect(updateResponse.ok()).toBeTruthy();
  59  |     const updateBody = await updateResponse.json();
  60  |     expect(updateBody.cart[0].quantity).toBe(1);
  61  | 
  62  |     const removeResponse = await apiContext.post('/api/cart/update', { data: { productId: 1, quantity: 0 } });
  63  |     expect(removeResponse.ok()).toBeTruthy();
  64  |     const removeBody = await removeResponse.json();
  65  |     expect(removeBody.cart).toHaveLength(0);
  66  | 
  67  |     await apiContext.dispose();
  68  |   });
  69  | 
  70  |   test('checkout endpoint should clear cart after successful payment', async ({ request }) => {
  71  |     const apiContext = await createAuthenticatedApiContext(request);
  72  | 
  73  |     await apiContext.post('/api/cart/add', { data: { productId: 2, quantity: 1 } });
  74  |     const cartBefore = await apiContext.get('/api/cart');
  75  |     expect((await cartBefore.json()).cart).toHaveLength(1);
  76  | 
  77  |     const checkoutResponse = await apiContext.post('/api/checkout', {
  78  |       data: {
  79  |         fullName: 'Test Customer',
  80  |         cardNumber: '4111111111111111',
  81  |         expiryDate: '12/25',
  82  |         cvv: '123',
  83  |         billingAddress: '123 Example Street',
  84  |       },
  85  |     });
  86  | 
  87  |     expect(checkoutResponse.ok()).toBeTruthy();
  88  |     const checkoutBody = await checkoutResponse.json();
  89  |     expect(checkoutBody.success).toBe(true);
  90  | 
  91  |     const cartAfter = await apiContext.get('/api/cart');
  92  |     expect((await cartAfter.json()).cart).toHaveLength(0);
  93  | 
  94  |     await apiContext.dispose();
  95  |   });
  96  | 
  97  |   test('returns endpoint should allow submitting and removing return requests', async ({ request }) => {
  98  |     const apiContext = await createAuthenticatedApiContext(request);
  99  | 
  100 |     const returnsBefore = await apiContext.get('/api/returns');
  101 |     expect((await returnsBefore.json()).returns).toEqual([]);
  102 | 
  103 |     const submitResponse = await apiContext.post('/api/returns', {
  104 |       data: { orderId: 'ORD-10001', reason: 'damaged', comments: 'Broken on arrival' },
  105 |     });
  106 |     expect(submitResponse.ok()).toBeTruthy();
```