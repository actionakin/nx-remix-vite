import { GeneratorCallback, Tree } from '@nx/devkit';
import { NormalizedSchema } from './normalize-options';
/** Add unit test config to the project */
export declare function addUnitTest(tree: Tree, options: NormalizedSchema): Promise<GeneratorCallback[]>;
