/// <reference types="vitest" />
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgrPlugin from 'vite-plugin-svgr';
import viteTsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), viteTsconfigPaths(), svgrPlugin()],
  server: {
    proxy: {
      '/api': 'http://localhost:9090',
    },
    port: 3000,
    open: true,
  },
  test: {
    globals: true,
    testTimeout: 60000,
    environment: 'jsdom',
    setupFiles: 'src/setupTests.ts',
    server: {
      deps: { inline: ['@skatteetaten'] },
    },
    include: ['src/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    exclude: ['src/e2e/**'],
    coverage: {
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['src/**'],
    },
  },
  build: {
    outDir: 'build',
    sourcemap: false,
  },
});
