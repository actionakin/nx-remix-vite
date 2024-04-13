import { type Tree } from '@nx/devkit';
import type { StorybookConfigurationSchema } from './schema';
export declare function remixStorybookConfiguration(tree: Tree, schema: StorybookConfigurationSchema): Promise<import("@nx/devkit").GeneratorCallback>;
export default function remixStorybookConfigurationInternal(tree: Tree, schema: StorybookConfigurationSchema): Promise<import("@nx/devkit").GeneratorCallback>;
