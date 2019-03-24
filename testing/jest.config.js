module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  moduleDirectories: ['node_modules', path.join(__dirname, 'src'), 'shared'],
  moduleNameMapper: {
    '\\.module\\.css$': 'identity-obj-proxy',
    '\\.css$': require.resolve('./test/style-mock.js')
  },
  // before Jest is loaded
  setupFiles: [],
  // ater Jest is loaded
  setupTestFrameworkScriptFile: require.resolve('setup-tests.js'),
  collectCoverageFrom: [‘**/src/**.js’],
  coverageThreshold: {
    global: {
      statements: 17,
      branches: 4,
      lines: 17,
      functions: 20
    }
  }
}
