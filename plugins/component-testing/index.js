"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nxComponentTestingPreset = void 0;
const cypress_preset_1 = require("@nx/cypress/plugins/cypress-preset");
const devkit_1 = require("@nx/devkit");
const vite_config_1 = require("../../src/utils/vite-config");
const path_1 = require("path");
/**
 * Remix nx preset for Cypress Component Testing
 *
 * This preset contains the base configuration
 * for your component tests that nx recommends.
 * including a devServer that supports nx workspaces.
 * you can easily extend this within your cypress config via spreading the preset
 * @example
 * export default defineConfig({
 *   component: {
 *     ...nxComponentTestingPreset(__dirname)
 *     // add your own config here
 *   }
 * })
 *
 * @param pathToConfig will be used for loading project options and to construct the output paths for videos and screenshots
 */
function nxComponentTestingPreset(pathToConfig) {
    const normalizedProjectRootPath = ['.ts', '.js'].some((ext) => pathToConfig.endsWith(ext))
        ? pathToConfig
        : (0, path_1.dirname)(pathToConfig);
    return {
        ...(0, cypress_preset_1.nxBaseCypressPreset)(pathToConfig),
        specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}',
        devServer: {
            ...{ framework: 'react', bundler: 'vite' },
            viteConfig: async () => {
                const viteConfigPath = (0, vite_config_1.findViteConfig)(normalizedProjectRootPath);
                const { mergeConfig, loadConfigFromFile, searchForWorkspaceRoot } = await Promise.resolve().then(() => require('vite'));
                const resolved = await loadConfigFromFile({
                    mode: 'watch',
                    command: 'serve',
                }, viteConfigPath);
                return mergeConfig(resolved.config, {
                    server: {
                        fs: {
                            allow: [
                                searchForWorkspaceRoot(normalizedProjectRootPath),
                                devkit_1.workspaceRoot,
                                (0, devkit_1.joinPathFragments)(devkit_1.workspaceRoot, 'node_modules/vite'),
                            ],
                        },
                    },
                });
            },
        },
    };
}
exports.nxComponentTestingPreset = nxComponentTestingPreset;
