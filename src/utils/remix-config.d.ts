import { Tree } from '@nx/devkit';
import type { AppConfig } from '@remix-run/dev';
export declare function getRemixConfigPath(tree: Tree, projectName: string): string;
export declare function getRemixConfigPathFromProjectRoot(tree: Tree, projectRoot: string): string;
export declare function getRemixConfigValues(tree: Tree, projectName: string): Promise<AppConfig>;
