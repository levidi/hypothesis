/** @type {import('jest').Config} */
const config = {
    cache: false,
    collectCoverage: true,
    coverageReporters: ["lcov"],
    testSequencer: './custom-sequencer.js',
    reporters: [
        "default",
        ["./node_modules/jest-html-reporter", {}]
    ]
};

module.exports = config;