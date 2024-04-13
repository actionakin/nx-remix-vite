"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUnitTestingSetup = void 0;
const devkit_1 = require("@nx/devkit");
const testing_config_utils_1 = require("../../../utils/testing-config-utils");
const versions_1 = require("../../../utils/versions");
function addUnitTestingSetup(tree, options) {
    const pathToTestSetup = (0, devkit_1.joinPathFragments)(options.projectRoot, 'src/test-setup.ts');
    let testSetupFileContents = '';
    if (tree.exists(pathToTestSetup)) {
        testSetupFileContents = tree.read(pathToTestSetup, 'utf-8');
    }
    tree.write(pathToTestSetup, (0, devkit_1.stripIndents) `${testSetupFileContents}
    import { installGlobals } from '@remix-run/node';
    import "@testing-library/jest-dom/matchers";
  installGlobals();`);
    if (options.unitTestRunner === 'vitest') {
        const pathToVitestConfig = (0, devkit_1.joinPathFragments)(options.projectRoot, `vite.config.ts`);
        (0, testing_config_utils_1.updateVitestTestSetup)(tree, pathToVitestConfig, './src/test-setup.ts');
    }
    else if (options.unitTestRunner === 'jest') {
        const pathToJestConfig = (0, devkit_1.joinPathFragments)(options.projectRoot, `jest.config.ts`);
        (0, testing_config_utils_1.updateJestTestSetup)(tree, pathToJestConfig, './src/test-setup.ts');
    }
    return (0, devkit_1.addDependenciesToPackageJson)(tree, {}, {
        '@testing-library/jest-dom': versions_1.testingLibraryJestDomVersion,
        '@testing-library/react': versions_1.testingLibraryReactVersion,
        '@testing-library/user-event': versions_1.testingLibraryUserEventsVersion,
        '@remix-run/node': (0, versions_1.getRemixVersion)(tree),
    });
}
exports.addUnitTestingSetup = addUnitTestingSetup;
