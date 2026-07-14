import fs from 'node:fs';
import path from 'node:path';

function write(relativePath, content) {
  fs.mkdirSync(path.dirname(relativePath), { recursive: true });
  fs.writeFileSync(relativePath, content.endsWith('\n') ? content : `${content}\n`);
}

const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
packageJson.engines = { node: '24.x' };
packageJson.scripts = {
  ...packageJson.scripts,
  'test:e2e': 'playwright test',
  'test:e2e:ui': 'playwright test --ui',
  check: 'npm audit --audit-level=high && npm test && npm run build',
  'check:full': 'npm run check && npm run test:e2e',
};
write('package.json', JSON.stringify(packageJson, null, 2));
write('.nvmrc', '24');

write('.github/dependabot.yml', `version: 2
updates:
  - package-ecosystem: npm
    directory: /
    schedule:
      interval: weekly
      day: monday
      time: "09:00"
      timezone: America/Sao_Paulo
    open-pull-requests-limit: 5
    groups:
      production-minor-patch:
        dependency-type: production
        update-types:
          - minor
          - patch
      development-minor-patch:
        dependency-type: development
        update-types:
          - minor
          - patch

  - package-ecosystem: github-actions
    directory: /
    schedule:
      interval: weekly
      day: monday
      time: "09:30"
      timezone: America/Sao_Paulo
    open-pull-requests-limit: 3
`);

write('src/lib/supabase.ts', `import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { AppConfig } from '../config/appConfig';
import type { Database } from './database.types';

export type SupabaseAppConfig = Extract<AppConfig, { mode: 'supabase' }>;

let client: SupabaseClient<Database> | undefined;

export function getSupabaseClient(config: SupabaseAppConfig): SupabaseClient<Database> {
  client ??= createClient<Database>(config.supabaseUrl, config.supabasePublishableKey);
  return client;
}
`);

write('src/services/createAppServices.ts', `import type { AppConfig } from '../config/appConfig';
import { initialDemandas } from '../data/initialDemandas';
import { getSupabaseClient } from '../lib/supabase';
import type { AuthService, DemandasRepository, ProfilesService } from './contracts';
import { LocalAuthService } from './localAuthService';
import { LocalDemandasRepository } from './localDemandasRepository';
import { SupabaseAuthService } from './supabaseAuthService';
import { SupabaseDemandasRepository } from './supabaseDemandasRepository';
import { SupabaseProfilesService } from './supabaseProfilesService';

export interface AppServices {
  mode: 'local' | 'supabase';
  auth: AuthService;
  demandas: DemandasRepository;
  profiles: ProfilesService;
}

export class ConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigurationError';
  }
}

const localProfilesService: ProfilesService = {
  list: async () => [],
  updateAccess: async () => undefined,
};

export function createAppServices(config: AppConfig, storage: Storage = window.localStorage): AppServices {
  if (config.mode === 'invalid') throw new ConfigurationError(config.message);
  if (config.mode === 'local') {
    return {
      mode: 'local',
      auth: new LocalAuthService(storage),
      demandas: new LocalDemandasRepository(storage, initialDemandas),
      profiles: localProfilesService,
    };
  }

  const client = getSupabaseClient(config);
  return {
    mode: 'supabase',
    auth: new SupabaseAuthService(client),
    demandas: new SupabaseDemandasRepository(client),
    profiles: new SupabaseProfilesService(client),
  };
}
`);

write('src/main.tsx', `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/inter';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { App } from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
`);

write('index.html', `<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#0f172a" />
    <meta name="description" content="Central institucional para acompanhamento de demandas da CTRH SME." />
    <title>Central de Demandas — CTRH SME</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`);

write('playwright.config.ts', `import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]]
    : 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    acceptDownloads: true,
  },
  projects: [
    { name: 'chromium-desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'chromium-mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 4173',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: { ...process.env, VITE_APP_MODE: 'local' },
  },
});
`);

write('tests/e2e/smoke.spec.ts', `import { expect, test } from '@playwright/test';

async function expectNoHorizontalOverflow(page: import('@playwright/test').Page) {
  const overflow = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }));
  expect(overflow.content).toBeLessThanOrEqual(overflow.viewport + 1);
}

test('fluxos críticos funcionam sem erros, dependências externas ou estouro horizontal', async ({ page }) => {
  const consoleErrors: string[] = [];
  const externalAssetRequests: string[] = [];

  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('request', (request) => {
    if (/fonts\\.googleapis\\.com|fonts\\.gstatic\\.com|cdnjs\\.cloudflare\\.com/.test(request.url())) {
      externalAssetRequests.push(request.url());
    }
  });

  await page.goto('/');
  await expect(page).toHaveTitle(/Central de Demandas/i);
  await expect(page.getByRole('button', { name: /acessar sistema/i })).toBeVisible();
  await expectNoHorizontalOverflow(page);

  await page.getByPlaceholder('usuario@rioeduca.net').fill('teste@rioeduca.net');
  await page.getByPlaceholder('••••••••').first().fill('senha-local-teste');
  await page.getByRole('button', { name: /acessar sistema/i }).click();

  await expect(page.getByRole('button', { name: /sair/i })).toBeVisible();
  await expect(page.getByText(/Ambiente Local/i)).toBeVisible();
  await expectNoHorizontalOverflow(page);

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: /exportar csv/i }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^demandas_sme_\\d{4}-\\d{2}-\\d{2}\\.csv$/);

  await page.getByRole('button', { name: /nova demanda/i }).click();
  await expect(page.getByRole('heading', { name: /nova demanda/i })).toBeVisible();
  await page.getByRole('button', { name: /^cancelar$/i }).click();

  await page.getByRole('button', { name: /^demandas$/i }).click();
  await page.getByRole('button', { name: /^abrir$/i }).first().click();
  await expect(page.getByRole('heading', { name: /processo nº/i })).toBeVisible();
  await page.getByRole('button', { name: /^editar$/i }).click();
  await expect(page.getByRole('heading', { name: /editar dados da demanda/i })).toBeVisible();
  await page.getByRole('button', { name: /^cancelar$/i }).click();
  await page.getByRole('button', { name: /^fechar$/i }).click();
  await expectNoHorizontalOverflow(page);

  expect(externalAssetRequests).toEqual([]);
  expect(consoleErrors).toEqual([]);
});
`);

write('.github/workflows/dependency-health.yml', `name: Dependency health

on:
  pull_request:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read

jobs:
  audit-test-build-browser:
    name: Audit, tests, build and browser QA
    runs-on: ubuntu-latest
    timeout-minutes: 30

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Node.js 24
        uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: npm

      - name: Install locked dependencies
        run: npm ci

      - name: Audit dependencies
        run: npm audit --audit-level=high

      - name: Run unit and integration tests
        run: npm test

      - name: Build production bundle
        run: npm run build

      - name: Install Chromium
        run: npx playwright install --with-deps chromium

      - name: Run browser smoke tests
        run: npm run test:e2e
`);

write('docs/superpowers/specs/2026-07-14-functional-modernization-design.md', `# Functional Modernization Design

## Goal

Modernize the production toolchain and reliability of the Central de Demandas without changing business rules, Supabase data, RLS policies or user permissions.

## Functional gains

- Real Chromium smoke tests in desktop and mobile viewports.
- Inter and Font Awesome hosted inside the application bundle.
- Supabase client typed from the source without an unsafe cast.
- Node.js 24 aligned across development, CI and deployment.
- Weekly dependency maintenance through Dependabot.
- Compatible upgrades of React, Supabase JS, Vite, Vitest and supporting packages.

## Scope boundaries

- Keep the existing React/Vite SPA architecture.
- Keep TypeScript on the latest compatible 5.9 release.
- Do not add state management, SSR, PWA, analytics or database changes.
- Merge only after audit, unit tests, production build, browser tests and Vercel Preview succeed.
`);

write('docs/superpowers/plans/2026-07-14-functional-modernization.md', `# Functional Modernization Implementation Plan

**Goal:** Deliver measurable reliability and QA gains while upgrading only dependencies proven compatible.

## Tasks

- [x] Pin Node.js 24 and add repeatable verification scripts.
- [x] Type the Supabase client at creation time.
- [x] Self-host Inter and Font Awesome assets.
- [x] Add desktop and mobile Chromium smoke tests.
- [x] Add weekly dependency maintenance.
- [x] Upgrade compatible dependencies and regenerate the npm lockfile.
- [x] Gate merge on audit, unit tests, build and browser QA.
`);
