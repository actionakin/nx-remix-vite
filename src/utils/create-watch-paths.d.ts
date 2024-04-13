import { type ProjectGraph, type ProjectGraphProjectNode } from '@nx/devkit';
/**
 * Generates an array of paths to watch based on the project dependencies.
 *
 * @param {string} dirname The absolute path to the Remix project, typically `__dirname`.
 */
export declare function createWatchPaths(dirname: string): Promise<string[]>;
export declare function getRelativeDependencyPaths(project: ProjectGraphProjectNode, deps: string[], graph: ProjectGraph): string[];
