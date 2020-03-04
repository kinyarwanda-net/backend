module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.(ts|js)',
    '!**/node_modules/**',
  ],
  rootDir: './',
  testMatch: [
    '<rootDir>/src/**/__tests__/**/?(*.)(spec|test).(ts|js)',
    '<rootDir>/src/**/?(*.)(spec|test).(ts|js)',
  ],
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  }
};
