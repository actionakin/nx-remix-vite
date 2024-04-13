import { type CreateDependencies, type CreateNodes } from '@nx/devkit';
export declare const createDependencies: CreateDependencies;
export interface RemixPluginOptions {
    buildTargetName?: string;
    devTargetName?: string;
    startTargetName?: string;
    typecheckTargetName?: string;
}
export declare const createNodes: CreateNodes<RemixPluginOptions>;
