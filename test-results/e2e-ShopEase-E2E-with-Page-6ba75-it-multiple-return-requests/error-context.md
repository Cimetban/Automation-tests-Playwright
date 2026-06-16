# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e.spec.js >> ShopEase E2E with Page Object Model >> submit multiple return requests
- Location: tests\e2e.spec.js:72:3

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 2
Received: 0
```

# Page snapshot

```yaml
- generic [ref=e1]:
  - banner [ref=e2]:
    - generic [ref=e3]:
      - heading "ShopEase" [level=1] [ref=e4]
      - paragraph [ref=e5]: Hassle-free returns
    - generic [ref=e6]:
      - link "Home" [ref=e7] [cursor=pointer]:
        - /url: index.html
      - link "Login" [ref=e8] [cursor=pointer]:
        - /url: login.html
  - main [ref=e9]:
    - generic [ref=e10]:
      - heading "Request a Return" [level=2] [ref=e11]
      - paragraph [ref=e12]: Enter your order details to initiate a return.
      - generic [ref=e13]:
        - generic [ref=e14]:
          - generic [ref=e15]: Order ID
          - textbox "Order ID" [ref=e16]:
            - /placeholder: e.g., ORD-12345
        - generic [ref=e17]:
          - generic [ref=e18]: Reason for return
          - combobox "Reason for return" [ref=e19] [cursor=pointer]:
            - option "-- Select a reason --" [selected]
            - option "Item damaged"
            - option "Item defective"
            - option "Wrong item received"
            - option "Not as described"
            - option "Changed my mind"
            - option "Other"
        - generic [ref=e20]:
          - generic [ref=e21]: Additional comments
          - textbox "Additional comments" [ref=e22]:
            - /placeholder: Please describe the issue...
        - button "Submit Return Request" [active] [ref=e23] [cursor=pointer]
        - paragraph [ref=e24]: Return request submitted successfully.
    - generic [ref=e25]:
      - heading "Your Return History" [level=2] [ref=e26]
      - generic [ref=e27]:
        - generic [ref=e28]:
          - generic [ref=e29]:
            - heading "Order ORD-11111" [level=3] [ref=e30]
            - paragraph [ref=e31]:
              - strong [ref=e32]: "Reason:"
              - text: defective
            - paragraph [ref=e33]:
              - strong [ref=e34]: "Submitted:"
              - text: Jun 16, 2026
            - paragraph [ref=e35]:
              - strong [ref=e36]: "Status:"
              - generic [ref=e37]: pending
          - button "Remove" [ref=e39] [cursor=pointer]
        - generic [ref=e40]:
          - generic [ref=e41]:
            - heading "Order ORD-22222" [level=3] [ref=e42]
            - paragraph [ref=e43]:
              - strong [ref=e44]: "Reason:"
              - text: wrong_item
            - paragraph [ref=e45]:
              - strong [ref=e46]: "Submitted:"
              - text: Jun 16, 2026
            - paragraph [ref=e47]:
              - strong [ref=e48]: "Status:"
              - generic [ref=e49]: pending
          - button "Remove" [ref=e51] [cursor=pointer]
  - contentinfo [ref=e52]:
    - paragraph [ref=e53]: Built with HTML, CSS, and JavaScript.
```

# Test source

```ts
  1  | const LoginPage = require('./pages/LoginPage');
  2  | const IndexPage = require('./pages/IndexPage');
  3  | const PaymentPage = require('./pages/PaymentPage');
  4  | const ReturnPage = require('./pages/ReturnPage');
  5  | const { test, expect } = require('@playwright/test');
  6  | 
  7  | test.describe('ShopEase E2E with Page Object Model', () => {
  8  |   test('login flow', async ({ page }) => {
  9  |     const loginPage = new LoginPage(page);
  10 |     await loginPage.goto();
  11 |     await loginPage.login('user@example.com', 'password123');
  12 | 
  13 |     await expect(page).toHaveURL(/index\.html$/);
  14 |     await expect(page.locator('#login-message')).toHaveText(/login successful/i);
  15 |   });
  16 | 
  17 |   test('add to cart and checkout redirects to payment', async ({ page }) => {
  18 |     const indexPage = new IndexPage(page);
  19 |     await indexPage.goto();
  20 | 
  21 |     await indexPage.addFirstProductToCart();
  22 |     await expect(page.locator(indexPage.cartCount)).toHaveText('1');
  23 |     await expect(page.locator(indexPage.cartItems)).toHaveCount(1);
  24 | 
  25 |     await indexPage.checkout();
  26 |     await expect(page).toHaveURL(/payment\.html$/);
  27 |     await expect(page.locator('#payment-summary')).toBeVisible();
  28 |   });
  29 | 
  30 |   test('payment flow completes and clears cart', async ({ page }) => {
  31 |     const indexPage = new IndexPage(page);
  32 |     const paymentPage = new PaymentPage(page);
  33 | 
  34 |     await indexPage.goto();
  35 |     await indexPage.addFirstProductToCart();
  36 |     await expect(page.locator(indexPage.cartCount)).toHaveText('1');
  37 | 
  38 |     await paymentPage.goto();
  39 |     await paymentPage.submitPaymentForm(
  40 |       'Test Customer',
  41 |       '4111 1111 1111 1111',
  42 |       '12/25',
  43 |       '123',
  44 |       '123 Example Street'
  45 |     );
  46 | 
  47 |     await expect(page.locator('#payment-message')).toHaveText(/payment successful/i);
  48 |     const stored = await paymentPage.getStoredCart();
  49 |     expect(stored).toBe(null);
  50 |   });
  51 | 
  52 |   test('submit return request and verify history', async ({ page }) => {
  53 |     const returnPage = new ReturnPage(page);
  54 |     await returnPage.goto();
  55 | 
  56 |     await returnPage.submitReturnForm(
  57 |       'ORD-98765',
  58 |       'damaged',
  59 |       'Item arrived with broken handle'
  60 |     );
  61 | 
  62 |     await expect(page.locator('#return-message')).toHaveText(/submitted successfully/i);
  63 |     await expect(page.locator('.return-item')).toHaveCount(1);
  64 | 
  65 |     const returns = await returnPage.getStoredReturns();
  66 |     expect(returns.length).toBe(1);
  67 |     expect(returns[0].orderId).toBe('ORD-98765');
  68 |     expect(returns[0].reason).toBe('damaged');
  69 |     expect(returns[0].status).toBe('pending');
  70 |   });
  71 | 
  72 |   test('submit multiple return requests', async ({ page }) => {
  73 |     const returnPage = new ReturnPage(page);
  74 |     await returnPage.goto();
  75 | 
  76 |     await returnPage.submitReturnForm('ORD-11111', 'defective');
  77 |     await returnPage.submitReturnForm('ORD-22222', 'wrong_item', 'Received wrong size');
  78 | 
  79 |     await expect(page.locator('.return-item')).toHaveCount(2);
  80 | 
  81 |     const returns = await returnPage.getStoredReturns();
> 82 |     expect(returns.length).toBe(2);
     |                            ^ Error: expect(received).toBe(expected) // Object.is equality
  83 |     expect(returns[0].orderId).toBe('ORD-11111');
  84 |     expect(returns[1].orderId).toBe('ORD-22222');
  85 |   });
  86 | });
  87 | 
```