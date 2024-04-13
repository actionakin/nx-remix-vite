"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRelativeDependencyPaths = exports.createWatchPaths = void 0;
const devkit_1 = require("@nx/devkit");
const find_project_for_path_1 = require("nx/src/project-graph/utils/find-project-for-path");
const project_graph_utils_1 = require("nx/src/utils/project-graph-utils");
const path_1 = require("path");
/**
 * Generates an array of paths to watch based on the project dependencies.
 *
 * @param {string} dirname The absolute path to the Remix project, typically `__dirname`.
 */
async function createWatchPaths(dirname) {
    const graph = await (0, devkit_1.createProjectGraphAsync)();
    const projectRootMappings = (0, find_project_for_path_1.createProjectRootMappings)(graph.nodes);
    const projectName = (0, find_project_for_path_1.findProjectForPath)((0, path_1.relative)(devkit_1.workspaceRoot, dirname), projectRootMappings);
    const deps = (0, project_graph_utils_1.findAllProjectNodeDependencies)(projectName, graph);
    return getRelativeDependencyPaths(graph.nodes[projectName], deps, graph);
}
exports.createWatchPaths = createWatchPaths;
// Exported for testing
function getRelativeDependencyPaths(project, deps, graph) {
    if (!project.data?.root) {
        throw new Error(`Project ${project.name} has no root set. Check the project configuration.`);
    }
    const paths = new Set();
    const offset = (0, devkit_1.offsetFromRoot)(project.data.root);
    const [baseProjectPath] = project.data.root.split('/');
    for (const dep of deps) {
        const node = graph.nodes[dep];
        if (!node?.data?.root)
            continue;
        const [basePath] = (0, path_1.normalize)(node.data.root).split(path_1.sep);
        const watchPath = baseProjectPath !== basePath ? basePath : node.data.root;
        const relativeWatchPath = (0, devkit_1.joinPathFragments)(offset, watchPath);
        paths.add(relativeWatchPath);
    }
    return Array.from(paths);
}
exports.getRelativeDependencyPaths = getRelativeDependencyPaths;
