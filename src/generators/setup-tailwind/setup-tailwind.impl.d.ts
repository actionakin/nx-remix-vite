import { type Tree } from '@nx/devkit';
import type { SetupTailwindSchema } from './schema';
export default function setupTailwind(tree: Tree, options: SetupTailwindSchema): Promise<() => void>;
