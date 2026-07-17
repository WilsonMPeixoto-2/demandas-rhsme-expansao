import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Expõe ao bundle somente URL e chaves públicas do Supabase.
// SUPABASE_SECRET_KEY e demais segredos continuam indisponíveis no navegador.
export default defineConfig({
  plugins: [react()],
  envPrefix: [
    'VITE_',
    'SUPABASE_URL',
    'SUPABASE_PUBLISHABLE_KEY',
    'SUPABASE_ANON_KEY',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    testTimeout: 10_000,
    exclude: ['tests/e2e/**', 'node_modules/**', 'dist/**'],
  },
});
