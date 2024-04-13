import { GeneratorCallback, Tree } from '@nx/devkit';
import { type NormalizedSchema } from './normalize-options';
/** Configure eslint for the project */
export declare function addLint(tree: Tree, options: NormalizedSchema): Promise<GeneratorCallback>;
