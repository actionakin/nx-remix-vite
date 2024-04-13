import { type Tree } from '@nx/devkit';
import type { NxRemixGeneratorSchema } from '../schema';
export interface RemixLibraryOptions extends NxRemixGeneratorSchema {
    projectName: string;
    projectRoot: string;
}
export declare function normalizeOptions(tree: Tree, options: NxRemixGeneratorSchema): Promise<RemixLibraryOptions>;
