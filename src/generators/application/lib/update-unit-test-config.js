"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUnitTestConfig = void 0;
const devkit_1 = require("@nx/devkit");
const testing_config_utils_1 = require("../../../utils/testing-config-utils");
const versions_1 = require("../../../utils/versions");
function updateUnitTestConfig(tree, pathToRoot, unitTestRunner, rootProject) {
    const pathToTestSetup = (0, devkit_1.joinPathFragments)(pathToRoot, `test-setup.ts`);
    tree.write(pathToTestSetup, (0, devkit_1.stripIndents) `
  import { installGlobals } from '@remix-run/node';
  import '@testing-library/jest-dom/matchers';
  installGlobals();`);
    if (unitTestRunner === 'vitest') {
        const pathToViteConfig = (0, devkit_1.joinPathFragments)(pathToRoot, 'vitest.config.ts');
        (0, testing_config_utils_1.updateVitestTestIncludes)(tree, pathToViteConfig, './app/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}');
        (0, testing_config_utils_1.updateVitestTestIncludes)(tree, pathToViteConfig, './tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}');
        (0, testing_config_utils_1.updateVitestTestSetup)(tree, pathToViteConfig, 'test-setup.ts');
    }
    else if (unitTestRunner === 'jest' && rootProject) {
        const pathToJestConfig = (0, devkit_1.joinPathFragments)(pathToRoot, 'jest.config.ts');
        tree.write('jest.preset.cjs', tree.read('jest.preset.js', 'utf-8'));
        (0, testing_config_utils_1.updateJestTestSetup)(tree, pathToJestConfig, `<rootDir>/test-setup.ts`);
        tree.write(pathToJestConfig, tree
            .read(pathToJestConfig, 'utf-8')
            .replace('jest.preset.js', 'jest.preset.cjs'));
    }
    const pathToTsConfigSpec = (0, devkit_1.joinPathFragments)(pathToRoot, `tsconfig.spec.json`);
    (0, devkit_1.updateJson)(tree, pathToTsConfigSpec, (json) => {
        json.include = [
            'vite.config.ts',
            'vitest.config.ts',
            'app/**/*.ts',
            'app/**/*.tsx',
            'app/**/*.js',
            'app/**/*.jsx',
            'tests/**/*.spec.ts',
            'tests/**/*.test.ts',
            'tests/**/*.spec.tsx',
            'tests/**/*.test.tsx',
            'tests/**/*.spec.js',
            'tests/**/*.test.js',
            'tests/**/*.spec.jsx',
            'tests/**/*.test.jsx',
        ];
        return json;
    });
    return (0, devkit_1.addDependenciesToPackageJson)(tree, {}, {
        '@testing-library/jest-dom': versions_1.testingLibraryJestDomVersion,
        '@testing-library/react': versions_1.testingLibraryReactVersion,
        '@testing-library/user-event': versions_1.testingLibraryUserEventsVersion,
        '@remix-run/node': (0, versions_1.getRemixVersion)(tree),
        '@remix-run/testing': (0, versions_1.getRemixVersion)(tree),
    });
}
exports.updateUnitTestConfig = updateUnitTestConfig;
