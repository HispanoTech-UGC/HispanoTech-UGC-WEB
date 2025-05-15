export default {
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.m?js$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'jsx'],
  testEnvironment: 'node',
};