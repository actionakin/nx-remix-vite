"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remixLibraryGeneratorInternal = exports.remixLibraryGenerator = void 0;
const devkit_1 = require("@nx/devkit");
const eslint_1 = require("@nx/eslint");
const react_1 = require("@nx/react");
const lib_1 = require("./lib");
async function remixLibraryGenerator(tree, schema) {
    return remixLibraryGeneratorInternal(tree, { addPlugin: false, ...schema });
}
exports.remixLibraryGenerator = remixLibraryGenerator;
async function remixLibraryGeneratorInternal(tree, schema) {
    const tasks = [];
    const options = await (0, lib_1.normalizeOptions)(tree, schema);
    const libGenTask = await (0, react_1.libraryGenerator)(tree, {
        name: options.projectName,
        style: options.style,
        unitTestRunner: options.unitTestRunner,
        tags: options.tags,
        importPath: options.importPath,
        directory: options.projectRoot,
        projectNameAndRootFormat: 'as-provided',
        skipFormat: true,
        skipTsConfig: false,
        linter: eslint_1.Linter.EsLint,
        component: true,
        buildable: options.buildable,
        addPlugin: options.addPlugin,
    });
    tasks.push(libGenTask);
    if (options.unitTestRunner && options.unitTestRunner !== 'none') {
        const pkgInstallTask = (0, lib_1.addUnitTestingSetup)(tree, options);
        tasks.push(pkgInstallTask);
    }
    (0, lib_1.addTsconfigEntryPoints)(tree, options);
    if (options.buildable) {
        (0, lib_1.updateBuildableConfig)(tree, options.projectName);
    }
    if (!options.skipFormat) {
        await (0, devkit_1.formatFiles)(tree);
    }
    return (0, devkit_1.runTasksInSerial)(...tasks);
}
exports.remixLibraryGeneratorInternal = remixLibraryGeneratorInternal;
exports.default = remixLibraryGenerator;
