module.exports = {
  // 'off' or 0 - turn the rule off
  // 'warn' or 1 - turn the rule on as a warning (doesn’t affect exit code)
  // 'error' or 2 - turn the rule on as an error (exit code is 1 when triggered)
      root: true,
      'extends': [
          'airbnb',
          'plugin:jest/recommended'
      ],
      plugins: [
          'react',
          'jest'
      ],
      parser: 'babel-eslint',
      parserOptions: {
          ecmaVersion: 6,
          sourceType: 'module',
          ecmaFeatures: {
              modules: true,
              jsx: true
          }
      },
      rules: {
          // General rule changes
          indent: ['error', 4, {
              SwitchCase: 1,
              VariableDeclarator: 1,
              outerIIFEBody: 1,
              FunctionDeclaration: {
                  parameters: 1,
                  body: 1
              },
              FunctionExpression: {
                  parameters: 1,
                  body: 1
              }
          }],
          'max-depth': ['error', 3],
          // React rule change
          'react/jsx-indent': ['error', 4],
          'react/jsx-indent-props': ['error', 4],
          'react/forbid-prop-types': ['error', { forbid: ['any'] }],  // allowing array and object for now
          // Jest rule changes
          'jest/no-disabled-tests': 'warn',
          'jest/no-focused-tests': 'error',
          'jest/no-identical-title': 'error',
          'jest/valid-expect': 'error',
          // Import fixes
          'import/prefer-default-export': 'off',
          'import/extensions': ['error', { jsx: 'always' }],
          'import/no-extraneous-dependencies': [ 'off' ],
          'import/no-unresolved': ['error', {
              commonjs: true,
              caseSensitive: true,
              ignore: [
                  'js',
                  'countries',
                  'static',
                  'public',
                  '@storybook*',
                  'backbone.marionette',
                  'george.templates',
                  'george.app.ui',
                  'src'
              ]
          }],
      },
      env: {
          browser: true,
          'jest/globals': true
      },
      globals: {
          'SEPA': true,
          'require': true,
          'define': true,
          'george': true,
          'GTmpl': true,
          '$': true,
          'jQuery': true,
          'google': true,
          'i18': true,
          'i18n': true,
          'i18nextContainer': true,
          'i18nextIntervalPluralPostProcessor': true,
          'moment': true,
          'webtrekkV3': true,
          'UserSnap': true,
          'formatMoneyHTML': true,
          'formatMoney': true,
          'formatMoneyDemoMode': true,
          'formatAmountObject': true,
          'formatIBAN': true,
          'formatBBAN': true,
          'escape': true,
          'qrcode': true,
          'd3': true,
          'sp': true,
          'getFullMonthName': true,
          'strcmp': true,
          'showFlickerCode': true,
          'loadFlickerCookie': true,
          'Uint8Array': true,
          'VBArray': true,
          'i18next': true,
          'i18nextXHRBackend': true,
          'selLng': true,
          'adlert': true,
          'errorFunciton': true,
          'base64': true,
          'contentId': true
      }
  };
  