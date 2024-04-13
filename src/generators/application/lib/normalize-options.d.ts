import { type Tree } from '@nx/devkit';
import { type NxRemixGeneratorSchema } from '../schema';
export interface NormalizedSchema extends NxRemixGeneratorSchema {
    projectName: string;
    projectRoot: string;
    e2eProjectName: string;
    e2eProjectRoot: string;
    e2eWebServerAddress: string;
    e2eWebServerTarget: string;
    e2ePort: number;
    parsedTags: string[];
}
export declare function normalizeOptions(tree: Tree, options: NxRemixGeneratorSchema): Promise<NormalizedSchema>;
