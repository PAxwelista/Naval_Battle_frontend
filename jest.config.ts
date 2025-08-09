import type { Config } from "jest";

import nextJest from "next/jest";

const createJestConfig = nextJest({
    dir: "./",
});

const config: Config = {
    preset: "ts-jest",
    moduleDirectories: ["node_modules", "<rootDir>/"],

    testEnvironment: "jest-environment-jsdom",
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1", 
        "\\.(css|scss|sass)$": "identity-obj-proxy",
        '^@components/(.*)$': '<rootDir>/src/components/$1',
    },
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    verbose: true,
};

export default createJestConfig(config);