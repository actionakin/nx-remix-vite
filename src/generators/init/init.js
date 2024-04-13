"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remixInitGeneratorInternal = exports.remixInitGenerator = void 0;
const devkit_1 = require("@nx/devkit");
const update_package_scripts_1 = require("@nx/devkit/src/utils/update-package-scripts");
const plugin_1 = require("../../plugins/plugin");
const versions_1 = require("../../utils/versions");
function addPlugin(tree) {
    const nxJson = (0, devkit_1.readNxJson)(tree);
    nxJson.plugins ??= [];
    for (const plugin of nxJson.plugins) {
        if (typeof plugin === 'string'
            ? plugin === '@nx/remix/plugin'
            : plugin.plugin === '@nx/remix/plugin') {
            return;
        }
    }
    nxJson.plugins.push({
        plugin: '@nx/remix/plugin',
        options: {
            buildTargetName: 'build',
            devTargetName: 'dev',
            startTargetName: 'start',
            typecheckTargetName: 'typecheck',
        },
    });
    (0, devkit_1.updateNxJson)(tree, nxJson);
}
function remixInitGenerator(tree, options) {
    return remixInitGeneratorInternal(tree, { addPlugin: false, ...options });
}
exports.remixInitGenerator = remixInitGenerator;
async function remixInitGeneratorInternal(tree, options) {
    const tasks = [];
    if (!options.skipPackageJson) {
        const installTask = (0, devkit_1.addDependenciesToPackageJson)(tree, {
            '@remix-run/serve': versions_1.remixVersion,
        }, {
            '@nx/web': versions_1.nxVersion,
            '@remix-run/dev': versions_1.remixVersion,
        }, undefined, options.keepExistingVersions);
        tasks.push(installTask);
    }
    const nxJson = (0, devkit_1.readNxJson)(tree);
    const addPluginDefault = process.env.NX_ADD_PLUGINS !== 'false' &&
        nxJson.useInferencePlugins !== false;
    options.addPlugin ??= addPluginDefault;
    if (options.addPlugin) {
        addPlugin(tree);
    }
    if (options.updatePackageScripts) {
        await (0, update_package_scripts_1.updatePackageScripts)(tree, plugin_1.createNodes);
    }
    if (!options.skipFormat) {
        await (0, devkit_1.formatFiles)(tree);
    }
    return (0, devkit_1.runTasksInSerial)(...tasks);
}
exports.remixInitGeneratorInternal = remixInitGeneratorInternal;
exports.default = remixInitGenerator;
