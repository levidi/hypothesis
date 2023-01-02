const Sequencer = require('@jest/test-sequencer').default;

class CustomSequencer extends Sequencer {

    sort(tests) {
        const orderPath = [
            `${__dirname}/src/health/test/health.test.js`,

            `${__dirname}/src/k8s/deployment/test/deployment.test.js`,
            `${__dirname}/src/k8s/namespace/test/namespace.test.js`,
        ]
        const orderedTests = tests.sort((testA, testB) => {
            const indexA = orderPath.indexOf(testA.path);
            const indexB = orderPath.indexOf(testB.path);

            if (indexA === indexB) return 0

            if (indexA === -1) return 1
            if (indexB === -1) return -1
            return indexA < indexB ? -1 : 1
        })
        return orderedTests
    }
}

module.exports = CustomSequencer;