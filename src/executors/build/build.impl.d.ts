import { type ExecutorContext } from '@nx/devkit';
import { type RemixBuildSchema } from './schema';
export default function buildExecutor(options: RemixBuildSchema, context: ExecutorContext): Promise<{
    success: boolean;
}>;
