module.exports = {
    preset: 'jest-preset-angular',
    setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
    testEnvironment: 'jsdom',

    globals: {
        'ts-jest': {
            tsconfig: '<rootDir>/tsconfig.spec.json',
            stringifyContentPathRegex: '\\.(html|svg)$',
        }
    },

    transform: {
        '^.+\\.(ts|mjs|js|html)$': 'jest-preset-angular',
    },

    transformIgnorePatterns: [
        'node_modules/(?!.*\\.mjs$|@angular|rxjs)'
    ],

    moduleNameMapper: {
        '^src/(.*)$': '<rootDir>/src/$1'
    },

    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/main.ts',
        '!src/**/*.module.ts',
        '!src/test.ts',
        '!src/environments/**'
    ],

    coverageDirectory: 'coverage',
    coverageReporters: ['html', 'text', 'text-summary'],

    testPathIgnorePatterns: [
        '/node_modules/',
        '/dist/'
    ]
};