module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
    '@vue/typescript',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'max-len': [2, 200],
    'no-restricted-syntax': 0,
    'no-continue': 'off',
    'class-methods-use-this': 'off',
    'no-useless-return': 'off',
    'consistent-return': 'off',
    'no-param-reassign': 'off',
    'lines-between-class-members': 'off',
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
};
