module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.+(ts|tsx|js)', '**/src/**/?(*.)+(spec|test).+(ts|tsx|js)'],
  moduleDirectories: ['node_modules', 'src'],
};
