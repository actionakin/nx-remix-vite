"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cypressComponentConfigurationGeneratorInternal = exports.cypressComponentConfigurationGenerator = void 0;
const devkit_1 = require("@nx/devkit");
const path_1 = require("path");
const react_1 = require("@nx/react");
function cypressComponentConfigurationGenerator(tree, options) {
    return cypressComponentConfigurationGeneratorInternal(tree, {
        addPlugin: false,
        ...options,
    });
}
exports.cypressComponentConfigurationGenerator = cypressComponentConfigurationGenerator;
async function cypressComponentConfigurationGeneratorInternal(tree, options) {
    const nxJson = (0, devkit_1.readNxJson)(tree);
    const addPluginDefault = process.env.NX_ADD_PLUGINS !== 'false' &&
        nxJson.useInferencePlugins !== false;
    options.addPlugin ??= addPluginDefault;
    await (0, react_1.cypressComponentConfigGenerator)(tree, {
        project: options.project,
        generateTests: options.generateTests,
        skipFormat: true,
        bundler: 'vite',
        buildTarget: '',
        addPlugin: options.addPlugin,
    });
    const project = (0, devkit_1.readProjectConfiguration)(tree, options.project);
    (0, devkit_1.generateFiles)(tree, (0, path_1.join)(__dirname, './files'), project.root, { tmpl: '' });
    if (!options.skipFormat) {
        await (0, devkit_1.formatFiles)(tree);
    }
}
exports.cypressComponentConfigurationGeneratorInternal = cypressComponentConfigurationGeneratorInternal;
exports.default = cypressComponentConfigurationGenerator;
