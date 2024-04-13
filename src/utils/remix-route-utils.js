"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveRemixAppDirectory = exports.checkRoutePathForErrors = exports.normalizeRoutePath = exports.resolveRemixRouteFile = void 0;
const devkit_1 = require("@nx/devkit");
const remix_config_1 = require("./remix-config");
/**
 *
 * @param tree
 * @param path to the route which could be fully specified or just "foo/bar"
 * @param projectName the name of the project where the route should be added
 * @param fileExtension the file extension to add to resolved route file
 * @returns file path to the route
 */
async function resolveRemixRouteFile(tree, path, projectName, fileExtension) {
    const { name: routePath } = (0, devkit_1.names)(path.replace(/^\//, '').replace(/\/$/, ''));
    if (!projectName) {
        return appendRouteFileExtension(tree, routePath, fileExtension);
    }
    else {
        const project = (0, devkit_1.readProjectConfiguration)(tree, projectName);
        if (!project)
            throw new Error(`Project does not exist: ${projectName}`);
        const normalizedRoutePath = normalizeRoutePath(routePath);
        const fileName = appendRouteFileExtension(tree, normalizedRoutePath, fileExtension);
        return (0, devkit_1.joinPathFragments)(await resolveRemixAppDirectory(tree, projectName), 'routes', fileName);
    }
}
exports.resolveRemixRouteFile = resolveRemixRouteFile;
function appendRouteFileExtension(tree, routePath, fileExtension) {
    // if no file extension specified, let's try to find it
    if (!fileExtension) {
        // see if the path already has it
        const extensionMatch = routePath.match(/(\.[^.]+)$/);
        if (extensionMatch) {
            fileExtension = extensionMatch[0];
        }
        else {
            // look for either .ts or .tsx to exist in tree
            if (tree.exists(`${routePath}.ts`)) {
                fileExtension = '.ts';
            }
            else {
                // default to .tsx if nothing else found
                fileExtension = '.tsx';
            }
        }
    }
    return routePath.endsWith(fileExtension)
        ? routePath
        : `${routePath}${fileExtension}`;
}
function normalizeRoutePath(path) {
    return path.indexOf('/routes/') > -1
        ? path.substring(path.indexOf('/routes/') + 8)
        : path;
}
exports.normalizeRoutePath = normalizeRoutePath;
function checkRoutePathForErrors(path) {
    return (path.match(/\w\.\.\w/) || // route.$withParams.tsx => route..tsx
        path.match(/\w\/\/\w/) || // route/$withParams/index.tsx => route//index.tsx
        path.match(/\w\/\.\w/) // route/$withParams.tsx => route/.tsx
    );
}
exports.checkRoutePathForErrors = checkRoutePathForErrors;
async function resolveRemixAppDirectory(tree, projectName) {
    const project = (0, devkit_1.readProjectConfiguration)(tree, projectName);
    const remixConfig = await (0, remix_config_1.getRemixConfigValues)(tree, projectName);
    return (0, devkit_1.joinPathFragments)(project.root, remixConfig.appDirectory ?? 'app');
}
exports.resolveRemixAppDirectory = resolveRemixAppDirectory;
