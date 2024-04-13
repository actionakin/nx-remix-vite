"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remixStorybookConfiguration = void 0;
const devkit_1 = require("@nx/devkit");
const path_1 = require("path");
const react_1 = require("@nx/react");
function remixStorybookConfiguration(tree, schema) {
    return remixStorybookConfigurationInternal(tree, {
        addPlugin: false,
        ...schema,
    });
}
exports.remixStorybookConfiguration = remixStorybookConfiguration;
async function remixStorybookConfigurationInternal(tree, schema) {
    const nxJson = (0, devkit_1.readNxJson)(tree);
    const addPluginDefault = process.env.NX_ADD_PLUGINS !== 'false' &&
        nxJson.useInferencePlugins !== false;
    schema.addPlugin ??= addPluginDefault;
    const { root } = (0, devkit_1.readProjectConfiguration)(tree, schema.project);
    if (!tree.exists((0, devkit_1.joinPathFragments)(root, 'vite.config.ts'))) {
        (0, devkit_1.generateFiles)(tree, (0, path_1.join)(__dirname, 'files'), root, { tpl: '' });
    }
    const task = await (0, react_1.storybookConfigurationGenerator)(tree, schema);
    return task;
}
exports.default = remixStorybookConfigurationInternal;
