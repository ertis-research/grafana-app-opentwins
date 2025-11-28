import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    ignores: [
      '**/logs',
      '**/*.log',
      '**/npm-debug.log*',
      '**/yarn-debug.log*',
      '**/yarn-error.log*',
      '**/.pnpm-debug.log*',
      '**/node_modules/',
      '.yarn/cache',
      '.yarn/unplugged',
      '.yarn/build-state.yml',
      '.yarn/install-state.gz',
      '**/.pnp.*',
      '**/pids',
      '**/*.pid',
      '**/*.seed',
      '**/*.pid.lock',
      '**/lib-cov',
      '**/coverage',
      '**/dist/',
      '**/artifacts/',
      '**/work/',
      '**/ci/',
      'test-results/',
      'playwright-report/',
      'blob-report/',
      'playwright/.cache/',
      'playwright/.auth/',
      '**/.idea',
      '**/.eslintcache',
    ],
    extends: [
      './.config/eslint.config.mjs',
    ],
    rules: {
      'react/prop-types': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'react/jsx-key': 'off',
      'react-hooks/rules-of-hooks': 'off',
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/no-deprecated': 'off',
      'react-hooks/set-state-in-effect': 'off'
    },
  },
]);
