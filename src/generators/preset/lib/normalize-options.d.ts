import { Tree } from '@nx/devkit';
import { RemixGeneratorSchema } from '../schema';
export interface NormalizedSchema extends RemixGeneratorSchema {
    appName: string;
    version?: 'classic' | 'vite';
    projectRoot: string;
    parsedTags: string[];
    unitTestRunner?: 'jest' | 'none' | 'vitest';
    e2eTestRunner?: 'cypress' | 'none';
    js?: boolean;
}
export declare function normalizeOptions(_: Tree, options: RemixGeneratorSchema): NormalizedSchema;
