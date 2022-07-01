
module.exports = {
    setupFilesAfterEnv: ["<rootDir>/setupTests.js"],
    moduleNameMapper: {
        '\\.(css|less)$': '<rootDir>/styleMock.js',
      }
  };