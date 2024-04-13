import type { Tree } from '@nx/devkit';
import { GeneratorCallback } from '@nx/devkit';
import type { NxRemixGeneratorSchema } from './schema';
export declare function remixLibraryGenerator(tree: Tree, schema: NxRemixGeneratorSchema): Promise<GeneratorCallback>;
export declare function remixLibraryGeneratorInternal(tree: Tree, schema: NxRemixGeneratorSchema): Promise<GeneratorCallback>;
export default remixLibraryGenerator;
