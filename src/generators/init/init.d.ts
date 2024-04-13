import { type Tree, GeneratorCallback } from '@nx/devkit';
import { type Schema } from './schema';
export declare function remixInitGenerator(tree: Tree, options: Schema): Promise<GeneratorCallback>;
export declare function remixInitGeneratorInternal(tree: Tree, options: Schema): Promise<GeneratorCallback>;
export default remixInitGenerator;
