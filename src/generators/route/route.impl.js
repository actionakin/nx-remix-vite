"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const devkit_1 = require("@nx/devkit");
const artifact_name_and_directory_utils_1 = require("@nx/devkit/src/generators/artifact-name-and-directory-utils");
const path_1 = require("path");
const remix_route_utils_1 = require("../../utils/remix-route-utils");
const action_impl_1 = require("../action/action.impl");
const loader_impl_1 = require("../loader/loader.impl");
const meta_impl_1 = require("../meta/meta.impl");
const style_impl_1 = require("../style/style.impl");
async function default_1(tree, options) {
    const { artifactName: name, directory, project: projectName, } = await (0, artifact_name_and_directory_utils_1.determineArtifactNameAndDirectoryOptions)(tree, {
        artifactType: 'route',
        callingGenerator: '@nx/remix:route',
        name: options.path.replace(/^\//, '').replace(/\/$/, ''),
        nameAndDirectoryFormat: options.nameAndDirectoryFormat,
        project: options.project,
    });
    const project = (0, devkit_1.readProjectConfiguration)(tree, projectName);
    if (!project)
        throw new Error(`Project does not exist: ${projectName}`);
    if (!options.skipChecks && (0, remix_route_utils_1.checkRoutePathForErrors)(options.path)) {
        throw new Error(`Your route path has an indicator of an un-escaped dollar sign for a route param. If this was intended, include the --skipChecks flag.`);
    }
    const routeFilePath = await (0, remix_route_utils_1.resolveRemixRouteFile)(tree, options.nameAndDirectoryFormat === 'as-provided'
        ? (0, devkit_1.joinPathFragments)(directory, name)
        : options.path, options.nameAndDirectoryFormat === 'as-provided' ? undefined : projectName, '.tsx');
    const nameToUseForComponent = options.nameAndDirectoryFormat === 'as-provided'
        ? name.replace('.tsx', '')
        : options.path.replace(/^\//, '').replace(/\/$/, '').replace('.tsx', '');
    const { className: componentName } = (0, devkit_1.names)(nameToUseForComponent === '.' || nameToUseForComponent === ''
        ? (0, path_1.basename)((0, path_1.dirname)(routeFilePath))
        : nameToUseForComponent);
    if (tree.exists(routeFilePath))
        throw new Error(`Path already exists: ${routeFilePath}`);
    tree.write(routeFilePath, (0, devkit_1.stripIndents) `


    export default function ${componentName}() {
    ${options.loader
        ? `
      return (
        <p>
          Message: {data.message}
        </p>
      );
    `
        : `return (<p>${componentName} works!</p>)`}
    }
  `);
    if (options.loader) {
        await (0, loader_impl_1.default)(tree, {
            path: routeFilePath,
            nameAndDirectoryFormat: 'as-provided',
        });
    }
    if (options.meta) {
        await (0, meta_impl_1.default)(tree, {
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
    if (options.style === 'css') {
        await (0, style_impl_1.default)(tree, {
            project: projectName,
            path: routeFilePath,
            nameAndDirectoryFormat: 'as-provided',
        });
    }
    await (0, devkit_1.formatFiles)(tree);
}
exports.default = default_1;
