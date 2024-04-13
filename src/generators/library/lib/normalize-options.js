"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeOptions = void 0;
const devkit_1 = require("@nx/devkit");
const project_name_and_root_utils_1 = require("@nx/devkit/src/generators/project-name-and-root-utils");
const get_import_path_1 = require("@nx/js/src/utils/get-import-path");
async function normalizeOptions(tree, options) {
    const { projectName, projectRoot, projectNameAndRootFormat } = await (0, project_name_and_root_utils_1.determineProjectNameAndRootOptions)(tree, {
        name: options.name,
        projectType: 'library',
        directory: options.directory,
        projectNameAndRootFormat: options.projectNameAndRootFormat,
        callingGenerator: '@nx/remix:library',
    });
    const nxJson = (0, devkit_1.readNxJson)(tree);
    const addPluginDefault = process.env.NX_ADD_PLUGINS !== 'false' &&
        nxJson.useInferencePlugins !== false;
    options.addPlugin ??= addPluginDefault;
    const importPath = options.importPath ?? (0, get_import_path_1.getImportPath)(tree, projectRoot);
    return {
        ...options,
        unitTestRunner: options.unitTestRunner ?? 'vitest',
        importPath,
        projectName,
        projectRoot,
        projectNameAndRootFormat,
    };
}
exports.normalizeOptions = normalizeOptions;
