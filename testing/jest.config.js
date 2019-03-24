module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '\\.module\\.css$': 'identity-obj-proxy',
    '\\.css$': require.resolve('./test/style-mock.js')
  },
  // before Jest is loaded
  setupFiles: [],
  // ater Jest is loaded
  setupTestFrameworkScriptFile: require.resolve('setup-tests.js')
}
