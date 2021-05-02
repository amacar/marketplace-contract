module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  testMatch: ['**/tests/**/*.+(ts|tsx|js)', '**/src/**/?(*.)+(spec|test).+(ts|tsx|js)'],
  moduleDirectories: ['node_modules', 'src'],
};
