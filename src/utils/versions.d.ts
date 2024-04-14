import { Tree } from '@nx/devkit';
export declare const nxVersion: any;
export declare const remixVersion = "^2.8.1";
export declare const isbotVersion = "^4.4.0";
export declare const reactVersion = "^18.2.0";
export declare const reactDomVersion = "^18.2.0";
export declare const typesReactVersion = "^18.2.0";
export declare const typesReactDomVersion = "^18.2.0";
export declare const eslintVersion = "^8.56.0";
export declare const typescriptVersion = "^5.3.3";
export declare const tailwindVersion = "^3.3.0";
export declare const testingLibraryReactVersion = "^14.1.2";
export declare const testingLibraryJestDomVersion = "^6.2.0";
export declare const testingLibraryUserEventsVersion = "^14.5.2";
export declare function getRemixVersion(tree: Tree): string;
export declare function getPackageVersion(tree: Tree, packageName: string): any;
/**
 * Infer bundler type depending on vite.config.ts presence
 * @param root workspace root path
 */
export declare function getBunlderType(root: string): 'classic' | 'vite';
