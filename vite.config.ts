import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    tsconfigPaths()
  ],
  build: {
    outDir: 'dist',
    lib: {
      entry: 'target/cleverio/main.js',
      name: 'CleverioPf100FeederCard',
      fileName: 'cleverio-pf100-feeder-card.bundle',
      formats: ['es']
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        manualChunks: undefined
      }
    }
  },
  test: {
    environment: 'jsdom',
    env: {
      TZ: 'Etc/UTC',
      IS_TEST: 'true',
    },
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.ts'],
    coverage: {
      include: [
        'src/**/*.js',
        'src/**/*.ts',
        'src/**/*.mjs',
        'src/**/*.vue',
        'src/**/*.jsx',
        'src/**/*.tsx'
      ],
      reporter: ['text', 'html'],
      provider: 'v8',
      reportsDirectory: 'coverage'
    }
  }
});