module.exports = {
  extends: ['@grafana/eslint-config', 'plugin:react-hooks/recommended'],
  rules: {
    'react/prop-types': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'react/jsx-key': 'off',
    'react-hooks/rules-of-hooks': 'off',
     '@typescript-eslint/naming-convention': 'off'
  },
};
