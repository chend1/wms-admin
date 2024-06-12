import pluginVue from 'eslint-plugin-vue'
export default [
  // ...pluginVue.configs['flat/essential'],
  // ...pluginVue.configs['flat/strongly-recommended'],
  ...pluginVue.configs['flat/recommended'],
  {
    files: '**/*.vue',
    ignores: ["**/*.config.js", "!**/eslint.config.js"],
    rules: {
      // override/add rules settings here, such as:
      'vue/no-unused-vars': 'error',
      "vue/component-definition-name-casing": ["error", "PascalCase" | "kebab-case"]
    }
  }
]