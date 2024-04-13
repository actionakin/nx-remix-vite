"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBuildableConfig = void 0;
const devkit_1 = require("@nx/devkit");
function updateBuildableConfig(tree, name) {
    // Nest dist under project root to we can link it
    const project = (0, devkit_1.readProjectConfiguration)(tree, name);
    project.targets.build.options = {
        ...project.targets.build.options,
        format: ['cjs'],
        outputPath: (0, devkit_1.joinPathFragments)(project.root, 'dist'),
    };
    (0, devkit_1.updateProjectConfiguration)(tree, name, project);
    // Point to nested dist for yarn/npm/pnpm workspaces
    (0, devkit_1.updateJson)(tree, (0, devkit_1.joinPathFragments)(project.root, 'package.json'), (json) => {
        json.main = './dist/index.cjs.js';
        json.typings = './dist/index.d.ts';
        return json;
    });
}
exports.updateBuildableConfig = updateBuildableConfig;
