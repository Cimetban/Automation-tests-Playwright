# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e.spec.js >> ShopEase E2E with Page Object Model >> login flow
- Location: tests\e2e.spec.js:8:3

# Error details

```
Error: expect(locator).toHaveText(expected) failed

Locator: locator('#login-message')
Expected pattern: /login successful/i
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toHaveText" with timeout 5000ms
  - waiting for locator('#login-message')

```

```yaml
- banner:
  - heading "ShopEase" [level=1]
  - paragraph: Smart shopping made simple
  - link "Login":
    - /url: login.html
  - link "Returns":
    - /url: returns.html
  - button "Cart 0"
- main:
  - heading "Find your favorites with fast checkout." [level=2]
  - paragraph: Discover trending products, add them to your cart, and shop with confidence.
  - link "Shop Now":
    - /url: "#products"
  - img "Shopping"
  - heading "Featured Products" [level=2]
  - article:
    - img "Comfy Sneakers"
    - heading "Comfy Sneakers" [level=3]
    - paragraph: Lightweight sneakers for daily wear with breathable mesh and cushioned soles.
    - text: $68.00
    - button "Add to cart"
  - article:
    - img "Classic Watch"
    - heading "Classic Watch" [level=3]
    - paragraph: Minimalist wristwatch with leather strap and elegant finishing.
    - text: $112.00
    - button "Add to cart"
  - article:
    - img "Wireless Headphones"
    - heading "Wireless Headphones" [level=3]
    - paragraph: Noise-canceling headphones with long battery life and superior sound.
    - text: $149.00
    - button "Add to cart"
  - article:
    - img "Elegant Backpack"
    - heading "Elegant Backpack" [level=3]
    - paragraph: Durable travel backpack with padded laptop pocket and modern design.
    - text: $79.00
    - button "Add to cart"
  - article:
    - img "Smart Mug"
    - heading "Smart Mug" [level=3]
    - paragraph: Temperature-controlled mug that keeps your drink warm for hours.
    - text: $42.00
    - button "Add to cart"
  - article:
    - img "Desk Lamp"
    - heading "Desk Lamp" [level=3]
    - paragraph: Adjustable desk lamp with warm light and touch controls.
    - text: $34.00
    - button "Add to cart"
- complementary:
  - heading "Your Cart" [level=3]
  - button "Close cart": ×
  - paragraph: Your cart is empty. Add items to get started.
  - text: Total
  - strong: $0.00
  - button "Checkout" [disabled]
- contentinfo:
  - paragraph: Built with HTML, CSS, and JavaScript.
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
> 14 |     await expect(page.locator('#login-message')).toHaveText(/login successful/i);
     |                                                  ^ Error: expect(locator).toHaveText(expected) failed
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
  82 |     expect(returns.length).toBe(2);
  83 |     expect(returns[0].orderId).toBe('ORD-11111');
  84 |     expect(returns[1].orderId).toBe('ORD-22222');
  85 |   });
  86 | });
  87 | 
```