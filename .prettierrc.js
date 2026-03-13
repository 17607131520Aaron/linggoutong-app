/**
 * Prettier 配置
 *
 * 这个配置文件遵循大厂前端代码规范
 * 详细文档: https://prettier.io/docs/en/options.html
 */
module.exports = {
  // 使用单引号
  singleQuote: true,

  // 使用分号
  semi: true,

  // 尾随逗号
  trailingComma: 'all',

  // 每行最大宽度
  printWidth: 100,

  // 缩进宽度
  tabWidth: 2,

  // 使用空格而不是制表符
  useTabs: false,

  // 行尾格式
  endOfLine: 'lf',

  // 对象花括号内的空格
  bracketSpacing: true,

  // 箭头函数参数总是使用括号
  arrowParens: 'always',

  // 不自动换行 markdown 文本
  proseWrap: 'never',

  // HTML 空白敏感度
  htmlWhitespaceSensitivity: 'strict',

  // JSX 中使用单引号
  jsxSingleQuote: true,

  // 多行 HTML 元素闭合括号位置
  bracketSameLine: false,

  // 对象属性引号
  quoteProps: 'as-needed',

  // 插件
  plugins: [],

  // 覆盖特定文件的配置
  overrides: [
    {
      files: '*.{json,json5}',
      options: {
        parser: 'json',
        singleQuote: false,
      },
    },
    {
      files: '*.md',
      options: {
        parser: 'markdown',
        proseWrap: 'preserve',
      },
    },
  ],
};
