module.exports = {
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/test/jest-env.js'],
  globalSetup: '<rootDir>/test/global-setup.js',
  globalTeardown: '<rootDir>/test/global-teardown.js',
  testMatch: ['<rootDir>/test/**/*.test.js'],
  testPathIgnorePatterns: ['/node_modules/'],
  verbose: true,
};
