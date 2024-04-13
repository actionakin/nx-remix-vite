import { Tree } from '@nx/devkit';
/**
 *
 * @param tree
 * @param path to the route which could be fully specified or just "foo/bar"
 * @param projectName the name of the project where the route should be added
 * @param fileExtension the file extension to add to resolved route file
 * @returns file path to the route
 */
export declare function resolveRemixRouteFile(tree: Tree, path: string, projectName?: string, fileExtension?: string): Promise<string>;
export declare function normalizeRoutePath(path: string): string;
export declare function checkRoutePathForErrors(path: string): RegExpMatchArray;
export declare function resolveRemixAppDirectory(tree: Tree, projectName: string): Promise<string>;
