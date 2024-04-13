import { GeneratorCallback, Tree } from '@nx/devkit';
import { NxRemixGeneratorSchema } from './schema';
export declare function remixApplicationGenerator(tree: Tree, options: NxRemixGeneratorSchema): Promise<GeneratorCallback>;
export declare function remixApplicationGeneratorInternal(tree: Tree, _options: NxRemixGeneratorSchema): Promise<GeneratorCallback>;
export default remixApplicationGenerator;
