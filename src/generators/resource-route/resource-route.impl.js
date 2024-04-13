"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const devkit_1 = require("@nx/devkit");
const artifact_name_and_directory_utils_1 = require("@nx/devkit/src/generators/artifact-name-and-directory-utils");
const remix_route_utils_1 = require("../../utils/remix-route-utils");
const action_impl_1 = require("../action/action.impl");
const loader_impl_1 = require("../loader/loader.impl");
async function default_1(tree, options) {
    const { artifactName: name, directory, project: projectName, } = await (0, artifact_name_and_directory_utils_1.determineArtifactNameAndDirectoryOptions)(tree, {
        artifactType: 'resource-route',
        callingGenerator: '@nx/remix:resource-route',
        name: options.path.replace(/^\//, '').replace(/\/$/, ''),
        nameAndDirectoryFormat: options.nameAndDirectoryFormat,
        project: options.project,
    });
    if (!options.skipChecks && (0, remix_route_utils_1.checkRoutePathForErrors)(options.path)) {
        throw new Error(`Your route path has an indicator of an un-escaped dollar sign for a route param. If this was intended, include the --skipChecks flag.`);
    }
    const routeFilePath = await (0, remix_route_utils_1.resolveRemixRouteFile)(tree, options.nameAndDirectoryFormat === 'as-provided'
        ? (0, devkit_1.joinPathFragments)(directory, name)
        : options.path, options.nameAndDirectoryFormat === 'as-provided' ? undefined : projectName, '.ts');
    if (tree.exists(routeFilePath))
        throw new Error(`Path already exists: ${options.path}`);
    if (!options.loader && !options.action)
        throw new Error('The resource route generator requires either `loader` or `action` to be true');
    tree.write(routeFilePath, '');
    if (options.loader) {
        await (0, loader_impl_1.default)(tree, {
            path: routeFilePath,
            nameAndDirectoryFormat: 'as-provided',
        });
    }
    if (options.action) {
        await (0, action_impl_1.default)(tree, {
            path: routeFilePath,
            nameAndDirectoryFormat: 'as-provided',
        });
    }
    await (0, devkit_1.formatFiles)(tree);
}
exports.default = default_1;
