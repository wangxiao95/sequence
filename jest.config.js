module.exports = {
  collectCoverage: true,
  "collectCoverageFrom": [
    "src/*.{ts,jsx}",
    "!**/node_modules/**",
    "!**/lib/**"
  ],
  displayName: {
    name: 'CLIENT',
    color: 'blue',
  },
  coverageReporters: ["json", "lcov", "text", "clover"],
}