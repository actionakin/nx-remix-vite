"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUnitTest = void 0;
const devkit_1 = require("@nx/devkit");
const update_unit_test_config_1 = require("./update-unit-test-config");
const assert_1 = require("assert");
const versions_1 = require("@nx/remix/src/utils/versions");
/** Add unit test config to the project */
async function addUnitTest(tree, options) {
    // An extra sanity check
    if (options.unitTestRunner === 'none') {
        (0, assert_1.fail)('Invalid test provider "none" was passed to the add-unittest');
    }
    const tasks = [];
    if (options.unitTestRunner === 'vitest') {
        tasks.push(await setupVitest(tree, options));
    }
    else {
        tasks.push(await setupJest(tree, options));
    }
    const pkgInstallTask = (0, update_unit_test_config_1.updateUnitTestConfig)(tree, options.projectRoot, options.unitTestRunner, options.rootProject);
    tasks.push(pkgInstallTask);
    return tasks;
}
exports.addUnitTest = addUnitTest;
async function setupVitest(tree, options) {
    const { vitestGenerator, createOrEditViteConfig } = (0, devkit_1.ensurePackage)('@nx/vite', (0, versions_1.getPackageVersion)(tree, 'nx'));
    const vitestTask = await vitestGenerator(tree, {
        uiFramework: 'react',
        project: options.projectName,
        coverageProvider: 'v8',
        inSourceTests: false,
        skipFormat: true,
        testEnvironment: 'jsdom',
        skipViteConfig: true,
        addPlugin: options.addPlugin,
    });
    createOrEditViteConfig(tree, {
        project: options.projectName,
        includeLib: false,
        includeVitest: true,
        testEnvironment: 'jsdom',
        imports: [`import react from '@vitejs/plugin-react';`],
        plugins: [`react()`],
    }, true, undefined, true);
    return vitestTask;
}
async function setupJest(tree, options) {
    const { configurationGenerator: jestConfigurationGenerator } = (0, devkit_1.ensurePackage)('@nx/jest', (0, versions_1.getPackageVersion)(tree, 'nx'));
    const jestTask = await jestConfigurationGenerator(tree, {
        project: options.projectName,
        setupFile: 'none',
        supportTsx: true,
        skipSerializers: false,
        skipPackageJson: false,
        skipFormat: true,
        addPlugin: options.addPlugin,
    });
    const projectConfig = (0, devkit_1.readProjectConfiguration)(tree, options.projectName);
    if (projectConfig.targets['test']?.options) {
        projectConfig.targets['test'].options.passWithNoTests = true;
        (0, devkit_1.updateProjectConfiguration)(tree, options.projectName, projectConfig);
    }
    return jestTask;
}
