import { type Tree } from '@nx/devkit';
export declare function updateVitestTestSetup(tree: Tree, pathToVitestConfig: string, pathToTestSetup: string): void;
export declare function updateJestTestSetup(tree: Tree, pathToJestConfig: string, pathToTestSetup: string): void;
export declare function updateJestTestMatch(tree: Tree, pathToJestConfig: string, includesString: string): void;
export declare function updateVitestTestIncludes(tree: Tree, pathToVitestConfig: string, includesString: string): void;
