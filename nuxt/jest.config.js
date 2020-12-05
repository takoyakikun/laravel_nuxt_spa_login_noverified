module.exports = {
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "^~/(.*)$": "<rootDir>/$1",
    "\\.(css|less|sass|scss)$": "<rootDir>/test/__mocks__/styleMock.js"
  },
  moduleFileExtensions: ["js", "vue", "json"],
  transform: {
    "^.+\\.js$": "babel-jest",
    ".*\\.(vue)$": "vue-jest"
  },
  transformIgnorePatterns: [
    "<rootDir>/node_modules/(?!vuetify/lib)(?!vee-validate/dist/rules)"
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    "<rootDir>/components/**/*.vue",
    "<rootDir>/pages/**/*.vue",
    "<rootDir>/layouts/**/*.vue",
    "<rootDir>/middleware/**/*.js"
  ],
  setupFiles: ["<rootDir>/test/jestSetup.js"]
}
