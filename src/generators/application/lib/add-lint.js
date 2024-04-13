"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addLint = void 0;
const devkit_1 = require("@nx/devkit");
const versions_1 = require("@nx/remix/src/utils/versions");
/** Configure eslint for the project */
async function addLint(tree, options) {
    const { lintProjectGenerator } = (0, devkit_1.ensurePackage)('@nx/eslint', (0, versions_1.getPackageVersion)(tree, 'nx'));
    const eslintTask = await lintProjectGenerator(tree, {
        linter: options.linter,
        project: options.projectName,
        tsConfigPaths: [
            (0, devkit_1.joinPathFragments)(options.projectRoot, 'tsconfig.app.json'),
        ],
        unitTestRunner: options.unitTestRunner,
        skipFormat: true,
        rootProject: options.rootProject,
        addPlugin: options.addPlugin,
    });
    tree.write((0, devkit_1.joinPathFragments)(options.projectRoot, '.eslintignore'), (0, devkit_1.stripIndents) `build
    public/build`);
    return eslintTask;
}
exports.addLint = addLint;
