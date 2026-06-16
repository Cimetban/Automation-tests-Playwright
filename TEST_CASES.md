# Shopping Website Test Cases

## 1. Login Test Cases

### TC-LOGIN-01: Successful login
- Preconditions: User has a valid registered account.
- Steps:
  1. Navigate to the login page.
  2. Enter a valid email address.
  3. Enter the correct password.
  4. Click the "Login" button.
- Expected Result:
  - User is redirected to the homepage or dashboard.
  - A welcome message or user account name is visible.
  - No error message is displayed.

### TC-LOGIN-02: Login with invalid password
- Preconditions: User account exists.
- Steps:
  1. Navigate to the login page.
  2. Enter a valid email address.
  3. Enter an incorrect password.
  4. Click the "Login" button.
- Expected Result:
  - Login is denied.
  - An error message appears indicating credentials are incorrect.
  - User remains on the login page.

### TC-LOGIN-03: Login with invalid email format
- Steps:
  1. Navigate to the login page.
  2. Enter an improperly formatted email (for example, `user@domain`).
  3. Enter any password.
  4. Click the "Login" button.
- Expected Result:
  - Form validation prevents submission or shows a validation error.
  - User sees a message about invalid email format.

### TC-LOGIN-04: Login with empty required fields
- Steps:
  1. Navigate to the login page.
  2. Leave the email field empty.
  3. Leave the password field empty.
  4. Click the "Login" button.
- Expected Result:
  - User sees required-field validation messages.
  - Login is not attempted.

## 2. Add to Shopping Cart Test Cases

### TC-CART-01: Add a single product to the cart
- Preconditions: User is on the product listing page.
- Steps:
  1. Select a product from the product grid.
  2. Click the "Add to cart" button for that product.
- Expected Result:
  - Product is added to the cart.
  - Cart count updates to `1`.
  - Cart panel displays the selected product with quantity `1`.
  - Cart total matches the product price.

### TC-CART-02: Add multiple different products
- Preconditions: User is on the product listing page.
- Steps:
  1. Add product A to the cart.
  2. Add product B to the cart.
- Expected Result:
  - Cart count updates to `2`.
  - Both product A and product B appear in the cart.
  - Cart total equals the sum of both product prices.

### TC-CART-03: Increase item quantity in cart
- Preconditions: Product is already in the cart.
- Steps:
  1. Open the cart panel.
  2. Click the quantity increase button for the product.
- Expected Result:
  - Product quantity increments by `1`.
  - Cart count and total update accordingly.

### TC-CART-04: Decrease item quantity in cart
- Preconditions: Product quantity is greater than `1` in the cart.
- Steps:
  1. Open the cart panel.
  2. Click the quantity decrease button for the product.
- Expected Result:
  - Product quantity decrements by `1`.
  - Cart count and total update accordingly.
  - If quantity becomes zero, the product is removed from the cart.

### TC-CART-05: Remove item from cart
- Preconditions: Product is in the cart.
- Steps:
  1. Open the cart panel.
  2. Click the "Remove" button for the product.
- Expected Result:
  - Product is removed from the cart.
  - Cart count updates accordingly.
  - If cart becomes empty, display an empty cart message.

### TC-CART-06: Add item and open cart panel automatically
- Preconditions: User is on the product listing page.
- Steps:
  1. Click the "Add to cart" button for any product.
- Expected Result:
  - Cart panel opens automatically.
  - Newly added product is visible in the cart panel.

## 3. Payment Test Cases

### TC-PAY-01: Successful checkout with items in cart
- Preconditions: At least one product is in the cart.
- Steps:
  1. Open the cart panel.
  2. Click the "Checkout" button.
- Expected Result:
  - A confirmation alert or message appears indicating the order is placed.
  - Cart is cleared after checkout.
  - Cart count resets to `0`.

### TC-PAY-02: Checkout button disabled with empty cart
- Preconditions: Cart is empty.
- Steps:
  1. Open the cart panel.
  2. Observe the checkout button state.
- Expected Result:
  - Checkout button is disabled.
  - User cannot initiate checkout.

### TC-PAY-03: Checkout displays correct total amount
- Preconditions: Multiple products in the cart.
- Steps:
  1. Open the cart panel.
  2. Review the displayed total amount.
  3. Click the "Checkout" button.
- Expected Result:
  - Total amount shown in the cart equals the sum of item prices and quantities.
  - Confirmation message references successful checkout.

### TC-PAY-04: Payment flow with invalid card information (future enhancement)
- Preconditions: Payment form is available.
- Steps:
  1. Enter invalid card details.
  2. Submit payment.
- Expected Result:
  - Payment is rejected.
  - User sees an error for invalid card information.
  - Cart remains unchanged.

### TC-PAY-05: Payment form required fields validation (future enhancement)
- Preconditions: Payment form is available.
- Steps:
  1. Leave required fields empty.
  2. Attempt to submit payment.
- Expected Result:
  - Validation messages appear for missing required fields.
  - Payment cannot proceed until required fields are completed.

## 4. Return Request Test Cases

### TC-RET-01: Submit return request successfully
- Preconditions: User is on the returns page.
- Steps:
  1. Enter an order ID (e.g., `ORD-12345`).
  2. Select a return reason from the dropdown.
  3. Optionally enter comments describing the issue.
  4. Click the "Submit Return Request" button.
- Expected Result:
  - Return request is submitted successfully.
  - A success message appears.
  - Return request appears in the "Your Return History" section.
  - Return status is set to `pending`.

### TC-RET-02: Submit return with empty required fields
- Preconditions: User is on the returns page.
- Steps:
  1. Leave the Order ID field empty.
  2. Leave the return reason dropdown unselected.
  3. Click the "Submit Return Request" button.
- Expected Result:
  - Form validation prevents submission.
  - An error message appears indicating required fields are missing.

### TC-RET-03: Multiple return requests display in history
- Preconditions: User has submitted at least one return request.
- Steps:
  1. Navigate to the returns page.
  2. Submit another return request with a different order ID.
  3. Observe the return history section.
- Expected Result:
  - Both return requests appear in the history.
  - Each entry shows order ID, reason, submission date, and status.
  - Requests are listed in chronological order.

### TC-RET-04: Return data persists after page reload
- Preconditions: User has submitted a return request.
- Steps:
  1. Submit a return request with order ID and reason.
  2. Refresh the page.
  3. Observe the return history.
- Expected Result:
  - Return request is still visible in the history.
  - Data persists via browser localStorage.

### TC-RET-05: Remove return request from history
- Preconditions: At least one return request exists in history.
- Steps:
  1. Click the "Remove" button next to a return request.
- Expected Result:
  - Return request is removed from the history.
  - If no returns remain, the empty message displays.
