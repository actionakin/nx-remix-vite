"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const devkit_1 = require("@nx/devkit");
const devkit_2 = require("@nx/devkit");
const application_impl_1 = require("../application/application.impl");
const setup_impl_1 = require("../setup/setup.impl");
const normalize_options_1 = require("./lib/normalize-options");
async function default_1(tree, _options) {
    const options = (0, normalize_options_1.normalizeOptions)(tree, _options);
    const tasks = [];
    const setupGenTask = await (0, setup_impl_1.default)(tree);
    tasks.push(setupGenTask);
    const nxJson = (0, devkit_1.readNxJson)(tree);
    const addPluginDefault = process.env.NX_ADD_PLUGINS !== 'false' &&
        nxJson.useInferencePlugins !== false;
    const appGenTask = await (0, application_impl_1.default)(tree, {
        name: options.appName,
        version: options.version ?? 'vite',
        tags: options.tags,
        skipFormat: true,
        rootProject: true,
        unitTestRunner: options.unitTestRunner ?? 'vitest',
        e2eTestRunner: options.e2eTestRunner ?? 'cypress',
        js: options.js ?? false,
        addPlugin: addPluginDefault,
    });
    tasks.push(appGenTask);
    tree.delete('apps');
    tree.delete('libs');
    await (0, devkit_1.formatFiles)(tree);
    return (0, devkit_2.runTasksInSerial)(...tasks);
}
exports.default = default_1;
