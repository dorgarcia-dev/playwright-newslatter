import { defineConfig, devices } from '@playwright/test';

// Config de los tests e2e. Están separados del código de la app (src/), en /e2e.
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry',
  },
  // Levanta la app (servidor estático de src/ con `npm start`) antes de ejecutar los tests.
  webServer: {
    command: 'npm start',
    url: 'http://localhost:4200',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
