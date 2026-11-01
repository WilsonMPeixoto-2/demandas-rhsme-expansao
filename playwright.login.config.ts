import { defineConfig } from '@playwright/test';

// Separate matrix: each CSS viewport runs once against the production build.
export default defineConfig({
  testDir: './tests/login',
  fullyParallel: false,
  workers: 1,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  reporter: 'list',
  outputDir: 'test-results/login-visual',
  use: {
    baseURL: process.env.LOGIN_PREVIEW_URL || 'http://127.0.0.1:4175',
    viewport: { width: 1586, height: 992 },
    browserName: 'chromium',
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: process.env.LOGIN_PREVIEW_URL ? undefined : {
    command: 'npm run preview -- --host 127.0.0.1 --port 4175',
    url: 'http://127.0.0.1:4175',
    reuseExistingServer: !process.env.CI,
  },
});
