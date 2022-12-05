module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: ['airbnb-base'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    quotes: [1, 'single', { avoidEscape: true }],
    'no-console': ['error', { allow: ['info', 'error'] }],
    semi: [2, 'never'],
    'global-require': 0,
    'no-restricted-syntax': 0,
    'nonblock-statement-body-position': 0,
    curly: 'off',
    'no-prototype-builtins': 'off',
    'no-use-before-define': 'off',
    'padded-blocks': 'off',
    'no-param-reassign': 'off',
    'object-curly-newline': 'off',
  },
}
