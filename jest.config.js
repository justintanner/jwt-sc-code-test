/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset: 'ts-jest',
  testEnvironment: "node",
  setupFilesAfterEnv: ['<rootDir>/singleton.ts'],
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
};
