"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBunlderType = exports.findViteConfig = void 0;
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
/**
 * Finds exact path to the vite config within `projectRootFullPath`
 * @param projectRootFullPath root search path
 */
function findViteConfig(projectRootFullPath) {
    const allowsExt = ['js', 'mjs', 'ts', 'cjs', 'mts', 'cts'];
    for (const ext of allowsExt) {
        if ((0, fs_extra_1.existsSync)((0, path_1.join)(projectRootFullPath, `vite.config.${ext}`))) {
            return (0, path_1.join)(projectRootFullPath, `vite.config.${ext}`);
        }
    }
}
exports.findViteConfig = findViteConfig;
/**
 * Wents through all vite plugins recursively
 */
function* getIterablePlugins(plugins) {
    for (const plugin of plugins) {
        if (plugin === false)
            continue;
        // PluginOption[]
        if (Array.isArray(plugin)) {
            yield* getIterablePlugins(plugin);
        }
        // Ignoring Promise interface for simplicity
        yield plugin;
    }
}
/**
 * Infer bundler type depending on vite.config.ts presence
 * @param root workspace root path
 */
async function getBunlderType(root) {
    const viteConfigExists = (0, fs_extra_1.existsSync)((0, path_1.join)(root, 'vite.config.ts'));
    if (!viteConfigExists)
        return 'classic';
    const viteConfigPath = findViteConfig(root);
    const { loadConfigFromFile } = await Promise.resolve().then(() => require('vite'));
    const { config: viteConfig } = await loadConfigFromFile({
        command: 'build',
        mode: 'watch',
    }, viteConfigPath);
    const hasRemixPlugin = Array.from(getIterablePlugins(viteConfig.plugins)).some((p) => p.name === 'remix');
    return hasRemixPlugin ? 'vite' : 'classic';
}
exports.getBunlderType = getBunlderType;
