module.exports = {
  root: true,
  extends: [
    '@react-native',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jest/recommended',
    'plugin:prettier/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
    ecmaFeatures: {
      jsx: true,
    },
    createDefaultProgram: true,
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'jest', 'prettier', 'import'],
  rules: {
    // Prettier 规则
    'prettier/prettier': ['warn', {}, { usePrettierrc: true }],

    // React 相关规则
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'react/display-name': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/no-unstable-nested-components': ['warn', { allowAsProps: true }],
    'react/jsx-curly-brace-presence': ['warn', { props: 'never', children: 'never' }],
    'react/jsx-boolean-value': ['warn', 'never'],
    'react/jsx-handler-names': [
      'warn',
      {
        eventHandlerPrefix: 'handle',
        eventHandlerPropPrefix: 'on',
      },
    ],
    'react/jsx-key': ['error', { checkFragmentShorthand: true }],
    'react/jsx-no-useless-fragment': 'warn',
    'react/jsx-pascal-case': 'error',
    'react/jsx-sort-props': [
      'warn',
      {
        callbacksLast: true,
        shorthandFirst: true,
        ignoreCase: true,
        reservedFirst: true,
      },
    ],
    'react/self-closing-comp': 'warn',

    // TypeScript 相关规则
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      },
    ],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/ban-ts-comment': 'warn',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/consistent-type-imports': [
      'warn',
      {
        prefer: 'type-imports',
        disallowTypeAnnotations: true,
      },
    ],
    '@typescript-eslint/consistent-type-definitions': ['warn', 'interface'],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/member-ordering': [
      'warn',
      {
        default: [
          'signature',
          'public-static-field',
          'protected-static-field',
          'private-static-field',
          'public-instance-field',
          'protected-instance-field',
          'private-instance-field',
          'constructor',
          'public-static-method',
          'protected-static-method',
          'private-static-method',
          'public-instance-method',
          'protected-instance-method',
          'private-instance-method',
        ],
      },
    ],
    '@typescript-eslint/naming-convention': [
      'warn',
      // {
      //   selector: 'interface',
      //   format: ['PascalCase'],
      //   prefix: ['I'],
      // },
      // {
      //   selector: 'typeAlias',
      //   format: ['PascalCase'],
      //   prefix: ['T'],
      // },
      {
        selector: 'enum',
        format: ['PascalCase'],
        prefix: ['E'],
      },
      // {
      //   selector: 'variable',
      //   types: ['boolean'],
      //   format: ['PascalCase'],
      //   prefix: ['is', 'has', 'can', 'should', 'will', 'did'],
      // },
    ],
    '@typescript-eslint/no-non-null-assertion': 'warn',
    '@typescript-eslint/prefer-optional-chain': 'warn',
    '@typescript-eslint/prefer-nullish-coalescing': 'warn',

    // 代码风格规则
    'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
    'no-unused-vars': 'off', // 使用 @typescript-eslint/no-unused-vars 代替
    'no-empty': ['error', { allowEmptyCatch: true }],
    'no-constant-condition': ['error', { checkLoops: false }],
    'no-duplicate-imports': 'off', // 使用 import/no-duplicates 代替
    'import/no-duplicates': 'error',
    eqeqeq: ['error', 'always', { null: 'ignore' }],
    'prefer-const': ['error', { destructuring: 'all' }],
    'no-var': 'error',
    'prefer-template': 'warn',
    'object-shorthand': 'warn',
    'prefer-destructuring': [
      'warn',
      {
        array: false,
        object: true,
      },
    ],
    'no-nested-ternary': 'warn',
    'no-unneeded-ternary': 'warn',
    'spaced-comment': ['warn', 'always'],
    'sort-imports': [
      'warn',
      {
        ignoreCase: true,
        ignoreDeclarationSort: true,
      },
    ],
    'import/order': [
      'warn',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],

    // React Native 特定规则
    'react-native/no-inline-styles': 'warn',
    'react-native/no-unused-styles': 'warn',
    'react-native/split-platform-components': 'warn',
    'react-native/no-color-literals': 'warn',
    'react-native/no-raw-text': [
      'warn',
      {
        skip: ['Text.Text'],
      },
    ],
    'react-native/no-single-element-style-arrays': 'warn',

    // Jest 规则
    'jest/no-disabled-tests': 'warn',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/valid-expect': 'error',
    'jest/prefer-to-be': 'warn',
    'jest/prefer-to-have-length': 'warn',
    'jest/prefer-to-contain': 'warn',
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {},
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  env: {
    node: true,
    browser: true,
    es6: true,
    'jest/globals': true,
  },
  globals: {
    __DEV__: true,
    global: true,
    window: true,
    document: true,
    navigator: true,
    fetch: true,
  },
  ignorePatterns: [
    'node_modules/',
    'android/',
    'ios/',
    'vendor/',
    'coverage/',
    'dist/',
    '*.config.js',
    '*.lock',
  ],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': [
          'warn',
          {
            allowExpressions: true,
            allowTypedFunctionExpressions: true,
            allowHigherOrderFunctions: true,
          },
        ],
        'no-undef': 'off', // TypeScript 自己会处理未定义的变量
      },
    },
    {
      files: ['*.js', '*.jsx'],
      parser: 'espree',
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      rules: {
        '@typescript-eslint/consistent-type-imports': 'off',
        '@typescript-eslint/consistent-type-definitions': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/member-ordering': 'off',
        '@typescript-eslint/naming-convention': 'off',
        '@typescript-eslint/prefer-optional-chain': 'off',
        '@typescript-eslint/prefer-nullish-coalescing': 'off',
      },
    },
    {
      files: ['*.test.ts', '*.test.tsx', '**/__tests__/**'],
      env: {
        jest: true,
      },
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        'react-native/no-raw-text': 'off',
      },
    },
  ],
};
