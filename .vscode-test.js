const { defineConfig } = require('@vscode/test-cli');

module.exports = defineConfig([
  {
    label: 'unitTests-insiders',
    files: 'out/test/**/*.test.js',
    version: 'insiders',
    launchArgs: ['--disable-extensions', '--headless', '--no-sandbox'],
    workspaceFolder: `${__dirname}`,
    mocha: {
      ui: 'tdd',
      timeout: 20000
    }
  },
  {
    label: 'unitTests-stable',
    files: 'out/test/**/*.test.js',
    version: 'stable',platform: 'desktop',
    launchArgs: ['--disable-extensions', '--headless', '--no-sandbox'],
    workspaceFolder: `${__dirname}`,
    // workspaceFolder: './',
    mocha: {
      ui: 'tdd',
      timeout: 20000
    }
  }
]);