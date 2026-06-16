class LoginPage {
  constructor(page) {
    this.page = page;
    this.emailField = '#email';
    this.passwordField = '#password';
    this.submitButton = 'button[type="submit"]';
    this.loginMessage = '#login-message';
  }

  async goto() {
    await this.page.goto('/login.html');
  }

  async fillEmail(email) {
    await this.page.fill(this.emailField, email);
  }

  async fillPassword(password) {
    await this.page.fill(this.passwordField, password);
  }

  async submit() {
    await Promise.all([
      this.page.waitForNavigation({ timeout: 5000 }),
      this.page.click(this.submitButton),
    ]);
  }

  async getLoginMessage() {
    return await this.page.textContent(this.loginMessage);
  }

  async login(email, password) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.submit();
  }
}

module.exports = LoginPage;
