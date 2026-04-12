module.exports = {
  moduleNameMapper: {
    '^@common/(.*)$': '<rootDir>/src/common/$1',
    '^@infrastructure/(.*)$': '<rootDir>/src/infrastructure/$1',
    '^@dto/(.*)$': '<rootDir>/src/dto/$1',
    '^@entity/(.*)$': '<rootDir>/src/types/$1',
    '^@modules/(.*)$': '<rootDir>/src/modules/$1'
  },
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testEnvironment: 'node',
  testRegex: '.e2e-spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest'
  }
};