class IndexPage {
  constructor(page) {
    this.page = page;
    this.addToCartButton = '.add-to-cart';
    this.cartCount = '#cart-count';
    this.cartItems = '.cart-item';
    this.checkoutButton = '#checkout-button';
  }

  async goto() {
    const path = require('path');
    const p = path.resolve(__dirname, '..', '..', 'index.html');
    const url = 'file://' + p.replace(/\\/g, '/');
    await this.page.goto(url);
  }

  async addFirstProductToCart() {
    const addBtn = await this.page.locator(this.addToCartButton).first();
    await addBtn.click();
  }

  async getCartCount() {
    return await this.page.textContent(this.cartCount);
  }

  async getCartItemsCount() {
    return await this.page.locator(this.cartItems).count();
  }

  async checkout() {
    await Promise.all([
      this.page.waitForNavigation({ timeout: 5000 }),
      this.page.click(this.checkoutButton),
    ]);
  }
}

module.exports = IndexPage;
