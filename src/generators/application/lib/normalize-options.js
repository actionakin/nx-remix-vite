"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeOptions = void 0;
const devkit_1 = require("@nx/devkit");
const project_name_and_root_utils_1 = require("@nx/devkit/src/generators/project-name-and-root-utils");
const eslint_1 = require("@nx/eslint");
async function normalizeOptions(tree, options) {
    const { projectName, projectRoot, projectNameAndRootFormat } = await (0, project_name_and_root_utils_1.determineProjectNameAndRootOptions)(tree, {
        name: options.name,
        projectType: 'application',
        directory: options.directory,
        projectNameAndRootFormat: options.projectNameAndRootFormat,
        rootProject: options.rootProject,
        callingGenerator: '@nx/remix:application',
    });
    options.rootProject = projectRoot === '.';
    options.projectNameAndRootFormat = projectNameAndRootFormat;
    const nxJson = (0, devkit_1.readNxJson)(tree);
    const addPluginDefault = process.env.NX_ADD_PLUGINS !== 'false' &&
        nxJson.useInferencePlugins !== false;
    options.addPlugin ??= addPluginDefault;
    let e2eWebServerTarget = options.addPlugin ? 'dev' : 'serve';
    if (options.addPlugin) {
        if (nxJson.plugins) {
            for (const plugin of nxJson.plugins) {
                if (typeof plugin === 'object' &&
                    plugin.plugin === '@nx/remix/plugin' &&
                    plugin.options.devTargetName) {
                    e2eWebServerTarget = plugin.options
                        .devTargetName;
                }
            }
        }
    }
    let e2ePort = options.addPlugin ? 3000 : 4200;
    if (nxJson.targetDefaults?.[e2eWebServerTarget] &&
        (nxJson.targetDefaults?.[e2eWebServerTarget].options?.port ||
            nxJson.targetDefaults?.[e2eWebServerTarget].options?.env?.PORT)) {
        e2ePort =
            nxJson.targetDefaults?.[e2eWebServerTarget].options?.port ||
                nxJson.targetDefaults?.[e2eWebServerTarget].options?.env?.PORT;
    }
    const e2eProjectName = options.rootProject ? 'e2e' : `${projectName}-e2e`;
    const e2eProjectRoot = options.rootProject ? 'e2e' : `${projectRoot}-e2e`;
    const e2eWebServerAddress = `http://localhost:${e2ePort}`;
    const parsedTags = options.tags
        ? options.tags.split(',').map((s) => s.trim())
        : [];
    return {
        ...options,
        linter: options.linter ?? eslint_1.Linter.EsLint,
        projectName,
        projectRoot,
        e2eProjectName,
        e2eProjectRoot,
        e2eWebServerAddress,
        e2eWebServerTarget,
        e2ePort,
        parsedTags,
    };
}
exports.normalizeOptions = normalizeOptions;
