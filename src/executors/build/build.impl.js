"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const devkit_1 = require("@nx/devkit");
const js_1 = require("@nx/js");
const fileutils_1 = require("@nx/workspace/src/utilities/fileutils");
const child_process_1 = require("child_process");
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const vite_config_1 = require("../../utils/vite-config");
async function buildRemixBuildArgs(options, context) {
    const projectRoot = context.projectGraph.nodes[context.projectName].data.root;
    const bundlerType = await (0, vite_config_1.getBunlderType)(projectRoot);
    const buildTargetName = bundlerType === 'vite' ? 'vite:build' : 'build';
    const args = [buildTargetName];
    if (options.sourcemap) {
        args.push(`--sourcemap`);
    }
    return args;
}
async function runBuild(options, context) {
    const projectRoot = context.projectGraph.nodes[context.projectName].data.root;
    return new Promise(async (resolve, reject) => {
        const remixBin = require.resolve('@remix-run/dev/dist/cli');
        const args = await buildRemixBuildArgs(options, context);
        const p = (0, child_process_1.fork)(remixBin, args, {
            cwd: (0, path_1.join)(context.root, projectRoot),
            stdio: 'inherit',
        });
        p.on('exit', (code) => {
            if (code === 0)
                resolve();
            else
                reject();
        });
    });
}
async function buildExecutor(options, context) {
    const projectRoot = context.projectGraph.nodes[context.projectName].data.root;
    try {
        await runBuild(options, context);
    }
    catch (error) {
        devkit_1.logger.error(`Error occurred while trying to build application. See above for more details.`);
        return { success: false };
    }
    if (!(0, fileutils_1.directoryExists)(options.outputPath)) {
        (0, fs_extra_1.mkdir)(options.outputPath);
    }
    let packageJson;
    if (options.generatePackageJson) {
        packageJson = (0, js_1.createPackageJson)(context.projectName, context.projectGraph, {
            target: context.targetName,
            root: context.root,
            isProduction: !options.includeDevDependenciesInPackageJson, // By default we remove devDependencies since this is a production build.
        });
        // Update `package.json` to reflect how users should run the build artifacts
        packageJson.scripts ??= {};
        // Don't override existing custom script since project may have its own server.
        if (!packageJson.scripts.start) {
            packageJson.scripts['start'] = 'remix-serve ./build/index.js';
        }
        await updatePackageJson(packageJson, context);
        (0, devkit_1.writeJsonFile)(`${options.outputPath}/package.json`, packageJson);
    }
    else {
        packageJson = (0, devkit_1.readJsonFile)((0, path_1.join)(projectRoot, 'package.json'));
    }
    if (options.generateLockfile) {
        const packageManager = (0, devkit_1.detectPackageManager)(context.root);
        const lockFile = (0, js_1.createLockFile)(packageJson, context.projectGraph, packageManager);
        (0, fs_extra_1.writeFileSync)(`${options.outputPath}/${(0, js_1.getLockFileName)(packageManager)}`, lockFile, {
            encoding: 'utf-8',
        });
    }
    // If output path is different from source path, then copy over the config and public files.
    // This is the default behavior when running `nx build <app>`.
    if (options.outputPath.replace(/\/$/, '') !== projectRoot) {
        (0, fs_extra_1.copySync)((0, path_1.join)(projectRoot, 'public'), (0, path_1.join)(options.outputPath, 'public'), {
            dereference: true,
        });
        (0, fs_extra_1.copySync)((0, path_1.join)(projectRoot, 'build'), (0, path_1.join)(options.outputPath, 'build'), {
            dereference: true,
        });
    }
    return { success: true };
}
exports.default = buildExecutor;
async function updatePackageJson(packageJson, context) {
    const projectRoot = context.projectGraph.nodes[context.projectName].data.root;
    if (!packageJson.scripts) {
        packageJson.scripts = {};
    }
    if (!packageJson.scripts.start) {
        packageJson.scripts.start = 'remix-serve build';
    }
    packageJson.dependencies ??= {};
    // These are always required for a production Remix app to run.
    const requiredPackages = ['react', 'react-dom', 'isbot', '@remix-run/node'];
    const bundlerType = await (0, vite_config_1.getBunlderType)(projectRoot);
    if (bundlerType === 'classic') {
        // These packages seem to be required for the older Remix version
        // However, newer Vite version does not need them
        requiredPackages.push(...[
            '@remix-run/css-bundle',
            '@remix-run/react',
            '@remix-run/serve',
            '@remix-run/dev',
        ]);
    }
    for (const pkg of requiredPackages) {
        const externalNode = context.projectGraph.externalNodes[`npm:${pkg}`];
        if (externalNode) {
            packageJson.dependencies[pkg] ??= externalNode.data.version;
        }
    }
}
