class PaymentPage {
  constructor(page) {
    this.page = page;
    this.fullNameField = '#fullName';
    this.cardNumberField = '#cardNumber';
    this.expiryDateField = '#expiryDate';
    this.cvvField = '#cvv';
    this.billingAddressField = '#billingAddress';
    this.submitButton = '#submit-payment';
    this.paymentMessage = '#payment-message';
  }

  async goto() {
    const path = require('path');
    const p = path.resolve(__dirname, '..', '..', 'payment.html');
    const url = 'file://' + p.replace(/\\/g, '/');
    await this.page.goto(url);
  }

  async fillPaymentForm(fullName, cardNumber, expiryDate, cvv, billingAddress) {
    await this.page.fill(this.fullNameField, fullName);
    await this.page.fill(this.cardNumberField, cardNumber);
    await this.page.fill(this.expiryDateField, expiryDate);
    await this.page.fill(this.cvvField, cvv);
    await this.page.fill(this.billingAddressField, billingAddress);
  }

  async submitPayment() {
    await this.page.click(this.submitButton);
    await this.page.waitForTimeout(800);
  }

  async getPaymentMessage() {
    return await this.page.textContent(this.paymentMessage);
  }

  async getStoredCart() {
    return await this.page.evaluate(() => localStorage.getItem('shopEaseCart'));
  }

  async submitPaymentForm(fullName, cardNumber, expiryDate, cvv, billingAddress) {
    await this.fillPaymentForm(fullName, cardNumber, expiryDate, cvv, billingAddress);
    await this.submitPayment();
  }
}

module.exports = PaymentPage;
