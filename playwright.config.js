const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  use: {
    headless: true,
    viewport: { width: 1280, height: 800 },
    actionTimeout: 10 * 1000,
    baseURL: 'http://127.0.0.1:3000',
  },
  webServer: {
    command: 'npm start',
    port: 3000,
    reuseExistingServer: true,
    timeout: 30 * 1000,
  },
});
