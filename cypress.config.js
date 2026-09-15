import { defineConfig } from 'cypress';

/**
 * Konfigurasi End-to-End testing dengan Cypress.
 *
 * baseUrl mengarah ke dev server Vite (dijalankan otomatis oleh script
 * `npm run e2e` melalui start-server-and-test).
 */
export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx}',
    supportFile: 'cypress/support/e2e.js',
    video: false,
    screenshotOnRunFailure: false,
    setupNodeEvents() {},
  },
});
