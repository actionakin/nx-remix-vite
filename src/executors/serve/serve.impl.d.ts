import { type ExecutorContext } from '@nx/devkit';
import { type RemixServeSchema } from './schema';
export default function serveExecutor(schema: RemixServeSchema, context: ExecutorContext): AsyncGenerator<{
    success: boolean;
    baseUrl: string;
}, void, undefined>;
