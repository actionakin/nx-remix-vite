/**
 * Finds exact path to the vite config within `projectRootFullPath`
 * @param projectRootFullPath root search path
 */
export declare function findViteConfig(projectRootFullPath: string): string;
/**
 * Infer bundler type depending on vite.config.ts presence
 * @param root workspace root path
 */
export declare function getBunlderType(root: string): Promise<'classic' | 'vite'>;
