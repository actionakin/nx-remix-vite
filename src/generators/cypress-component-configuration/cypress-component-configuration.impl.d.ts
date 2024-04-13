import { type Tree } from '@nx/devkit';
import { type CypressComponentConfigurationSchema } from './schema';
export declare function cypressComponentConfigurationGenerator(tree: Tree, options: CypressComponentConfigurationSchema): Promise<void>;
export declare function cypressComponentConfigurationGeneratorInternal(tree: Tree, options: CypressComponentConfigurationSchema): Promise<void>;
export default cypressComponentConfigurationGenerator;
