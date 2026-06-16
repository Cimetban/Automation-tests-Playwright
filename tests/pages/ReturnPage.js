class ReturnPage {
  constructor(page) {
    this.page = page;
    this.orderIdField = '#orderId';
    this.returnReasonField = '#returnReason';
    this.commentsField = '#comments';
    this.submitButton = '#return-form button[type="submit"]';
    this.returnMessage = '#return-message';
    this.returnHistory = '#return-history';
  }

  async goto() {
    const path = require('path');
    const p = path.resolve(__dirname, '..', '..', 'returns.html');
    const url = 'file://' + p.replace(/\\/g, '/');
    await this.page.goto(url);
  }

  async fillReturnForm(orderId, reason, comments = '') {
    await this.page.fill(this.orderIdField, orderId);
    await this.page.selectOption(this.returnReasonField, reason);
    if (comments) {
      await this.page.fill(this.commentsField, comments);
    }
  }

  async submitReturn() {
    await this.page.click(this.submitButton);
    await this.page.waitForTimeout(500);
  }

  async submitReturnForm(orderId, reason, comments = '') {
    await this.fillReturnForm(orderId, reason, comments);
    await this.submitReturn();
  }

  async getReturnMessage() {
    return await this.page.textContent(this.returnMessage);
  }

  async getReturnHistoryCount() {
    return await this.page.locator('.return-item').count();
  }

  async getStoredReturns() {
    return await this.page.evaluate(() => JSON.parse(localStorage.getItem('shopEaseReturns') || '[]'));
  }
}

module.exports = ReturnPage;
