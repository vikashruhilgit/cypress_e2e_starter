
module.exports = {
  extends: [
    "eslint:recommended", 
    "plugin:@typescript-eslint/recommended-type-checked"
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
  root: true,
  overrides: [
    {
      files: ['*.js'],

      extends: ['plugin:@typescript-eslint/disable-type-checked'],
    },
  ],
  ignorePatterns: [
    "*.js", "*.cjs"
  ]
};
