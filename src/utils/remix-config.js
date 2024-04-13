"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRemixConfigValues = exports.getRemixConfigPathFromProjectRoot = exports.getRemixConfigPath = void 0;
const devkit_1 = require("@nx/devkit");
function getRemixConfigPath(tree, projectName) {
    const project = (0, devkit_1.readProjectConfiguration)(tree, projectName);
    if (!project)
        throw new Error(`Project does not exist: ${projectName}`);
    for (const ext of ['.mjs', '.cjs', '.js']) {
        const configPath = (0, devkit_1.joinPathFragments)(project.root, `remix.config${ext}`);
        if (tree.exists(configPath)) {
            return configPath;
        }
    }
}
exports.getRemixConfigPath = getRemixConfigPath;
function getRemixConfigPathFromProjectRoot(tree, projectRoot) {
    let pathToRemixConfig;
    for (const ext of ['.js', '.mjs', '.cjs']) {
        pathToRemixConfig = (0, devkit_1.joinPathFragments)(projectRoot, `remix.config${ext}`);
        if (tree.exists(pathToRemixConfig)) {
            return pathToRemixConfig;
        }
    }
    throw new Error(`Could not find a Remix Config File. Please ensure a "remix.config.js" file exists at the root of your project.`);
}
exports.getRemixConfigPathFromProjectRoot = getRemixConfigPathFromProjectRoot;
const _remixConfigCache = {};
async function getRemixConfigValues(tree, projectName) {
    const remixConfigPath = (0, devkit_1.joinPathFragments)(devkit_1.workspaceRoot, getRemixConfigPath(tree, projectName));
    const cacheKey = `${projectName}/${remixConfigPath}`;
    let appConfig = _remixConfigCache[cacheKey];
    if (!appConfig) {
        try {
            const importedConfig = await Function(`return import("${remixConfigPath}?t=${Date.now()}")`)();
            appConfig = (importedConfig?.default || importedConfig);
        }
        catch {
            appConfig = require(remixConfigPath);
        }
        _remixConfigCache[cacheKey] = appConfig;
    }
    return appConfig;
}
exports.getRemixConfigValues = getRemixConfigValues;
