"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNodes = exports.createDependencies = void 0;
const cache_directory_1 = require("nx/src/utils/cache-directory");
const devkit_1 = require("@nx/devkit");
const calculate_hash_for_create_nodes_1 = require("@nx/devkit/src/utils/calculate-hash-for-create-nodes");
const get_named_inputs_1 = require("@nx/devkit/src/utils/get-named-inputs");
const js_1 = require("@nx/js");
const path_1 = require("path");
const fs_1 = require("fs");
const config_utils_1 = require("@nx/devkit/src/utils/config-utils");
const cachePath = (0, path_1.join)(cache_directory_1.projectGraphCacheDirectory, 'remix.hash');
const targetsCache = (0, fs_1.existsSync)(cachePath) ? readTargetsCache() : {};
const calculatedTargets = {};
function readTargetsCache() {
    return (0, devkit_1.readJsonFile)(cachePath);
}
function writeTargetsToCache(targets) {
    (0, devkit_1.writeJsonFile)(cachePath, targets);
}
const createDependencies = () => {
    writeTargetsToCache(calculatedTargets);
    return [];
};
exports.createDependencies = createDependencies;
exports.createNodes = [
    '**/remix.config.{js,cjs,mjs}',
    async (configFilePath, options, context) => {
        const projectRoot = (0, path_1.dirname)(configFilePath);
        const fullyQualifiedProjectRoot = (0, path_1.join)(context.workspaceRoot, projectRoot);
        // Do not create a project if package.json and project.json isn't there
        const siblingFiles = (0, fs_1.readdirSync)(fullyQualifiedProjectRoot);
        if (!siblingFiles.includes('package.json') &&
            !siblingFiles.includes('project.json') &&
            !siblingFiles.includes('vite.config.ts') &&
            !siblingFiles.includes('vite.config.js')) {
            return {};
        }
        options = normalizeOptions(options);
        const hash = (0, calculate_hash_for_create_nodes_1.calculateHashForCreateNodes)(projectRoot, options, context, [
            (0, js_1.getLockFileName)((0, devkit_1.detectPackageManager)(context.workspaceRoot)),
        ]);
        const targets = targetsCache[hash]
            ? targetsCache[hash]
            : await buildRemixTargets(configFilePath, projectRoot, options, context, siblingFiles);
        calculatedTargets[hash] = targets;
        return {
            projects: {
                [projectRoot]: {
                    root: projectRoot,
                    targets,
                },
            },
        };
    },
];
async function buildRemixTargets(configFilePath, projectRoot, options, context, siblingFiles) {
    const namedInputs = (0, get_named_inputs_1.getNamedInputs)(projectRoot, context);
    const { buildDirectory, assetsBuildDirectory, serverBuildPath } = await getBuildPaths(configFilePath, context.workspaceRoot);
    const targets = {};
    targets[options.buildTargetName] = buildTarget(options.buildTargetName, projectRoot, buildDirectory, assetsBuildDirectory, namedInputs);
    targets[options.devTargetName] = devTarget(serverBuildPath, projectRoot);
    targets[options.startTargetName] = startTarget(projectRoot, serverBuildPath, options.buildTargetName);
    targets[options.typecheckTargetName] = typecheckTarget(projectRoot, namedInputs, siblingFiles);
    return targets;
}
function buildTarget(buildTargetName, projectRoot, buildDirectory, assetsBuildDirectory, namedInputs) {
    const serverBuildOutputPath = projectRoot === '.'
        ? (0, devkit_1.joinPathFragments)(`{workspaceRoot}`, buildDirectory)
        : (0, devkit_1.joinPathFragments)(`{workspaceRoot}`, projectRoot, buildDirectory);
    const assetsBuildOutputPath = projectRoot === '.'
        ? (0, devkit_1.joinPathFragments)(`{workspaceRoot}`, assetsBuildDirectory)
        : (0, devkit_1.joinPathFragments)(`{workspaceRoot}`, projectRoot, assetsBuildDirectory);
    return {
        cache: true,
        dependsOn: [`^${buildTargetName}`],
        inputs: [
            ...('production' in namedInputs
                ? ['production', '^production']
                : ['default', '^default']),
        ],
        outputs: [serverBuildOutputPath, assetsBuildOutputPath],
        command: 'remix build',
        options: { cwd: projectRoot },
    };
}
function devTarget(serverBuildPath, projectRoot) {
    return {
        command: 'remix dev --manual',
        options: { cwd: projectRoot },
    };
}
function startTarget(projectRoot, serverBuildPath, buildTargetName) {
    return {
        dependsOn: [buildTargetName],
        command: `remix-serve ${serverBuildPath}`,
        options: {
            cwd: projectRoot,
        },
    };
}
function typecheckTarget(projectRoot, namedInputs, siblingFiles) {
    const hasTsConfigAppJson = siblingFiles.includes('tsconfig.app.json');
    const command = `tsc${hasTsConfigAppJson ? ` --project tsconfig.app.json` : ``}`;
    return {
        command,
        cache: true,
        inputs: [
            ...('production' in namedInputs
                ? ['production', '^production']
                : ['default', '^default']),
        ],
        options: {
            cwd: projectRoot,
        },
    };
}
async function getBuildPaths(configFilePath, workspaceRoot) {
    const configPath = (0, path_1.join)(workspaceRoot, configFilePath);
    let appConfig = await (0, config_utils_1.loadConfigFile)(configPath);
    return {
        buildDirectory: 'build',
        serverBuildPath: appConfig.serverBuildPath ?? 'build/index.js',
        assetsBuildDirectory: appConfig.assetsBuildDirectory ?? 'public/build',
    };
}
function normalizeOptions(options) {
    options ??= {};
    options.buildTargetName ??= 'build';
    options.devTargetName ??= 'dev';
    options.startTargetName ??= 'start';
    options.typecheckTargetName ??= 'typecheck';
    return options;
}
