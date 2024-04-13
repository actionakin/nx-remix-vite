"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addE2E = void 0;
const devkit_1 = require("@nx/devkit");
const versions_1 = require("../../../utils/versions");
async function addE2E(tree, options) {
    if (options.e2eTestRunner === 'cypress') {
        const { configurationGenerator } = (0, devkit_1.ensurePackage)('@nx/cypress', (0, versions_1.getPackageVersion)(tree, 'nx'));
        // TODO(colum): Remix needs a different approach to serve-static
        // Likely via remix start
        // addFileServerTarget(tree, options, 'serve-static');
        (0, devkit_1.addProjectConfiguration)(tree, options.e2eProjectName, {
            projectType: 'application',
            root: options.e2eProjectRoot,
            sourceRoot: (0, devkit_1.joinPathFragments)(options.e2eProjectRoot, 'src'),
            targets: {},
            tags: [],
            implicitDependencies: [options.projectName],
        });
        return await configurationGenerator(tree, {
            project: options.e2eProjectName,
            directory: 'src',
            skipFormat: true,
            devServerTarget: `${options.projectName}:${options.e2eWebServerTarget}:development`,
            baseUrl: options.e2eWebServerAddress,
            addPlugin: options.addPlugin,
        });
    }
    else if (options.e2eTestRunner === 'playwright') {
        const { configurationGenerator } = (0, devkit_1.ensurePackage)('@nx/playwright', (0, versions_1.getPackageVersion)(tree, 'nx'));
        (0, devkit_1.addProjectConfiguration)(tree, options.e2eProjectName, {
            projectType: 'application',
            root: options.e2eProjectRoot,
            sourceRoot: (0, devkit_1.joinPathFragments)(options.e2eProjectRoot, 'src'),
            targets: {},
            tags: [],
            implicitDependencies: [options.projectName],
        });
        return configurationGenerator(tree, {
            project: options.e2eProjectName,
            skipFormat: true,
            skipPackageJson: false,
            directory: 'src',
            js: false,
            linter: options.linter,
            setParserOptionsProject: false,
            webServerCommand: `${(0, devkit_1.getPackageManagerCommand)().exec} nx ${options.e2eWebServerTarget} ${options.name}`,
            webServerAddress: options.e2eWebServerAddress,
            rootProject: options.rootProject,
            addPlugin: options.addPlugin,
        });
    }
    else {
        return () => { };
    }
}
exports.addE2E = addE2E;
function addFileServerTarget(tree, options, targetName) {
    const projectConfig = (0, devkit_1.readProjectConfiguration)(tree, options.projectName);
    projectConfig.targets[targetName] = {
        executor: '@nx/web:file-server',
        options: {
            buildTarget: `${options.projectName}:build`,
            port: options.e2ePort,
        },
    };
    (0, devkit_1.updateProjectConfiguration)(tree, options.projectName, projectConfig);
}
