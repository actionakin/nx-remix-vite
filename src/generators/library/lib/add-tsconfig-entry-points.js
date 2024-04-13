"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addTsconfigEntryPoints = void 0;
const devkit_1 = require("@nx/devkit");
const js_1 = require("@nx/js");
function addTsconfigEntryPoints(tree, options) {
    const { sourceRoot } = (0, devkit_1.readProjectConfiguration)(tree, options.projectName);
    const serverFilePath = (0, devkit_1.joinPathFragments)(sourceRoot, 'server.ts');
    tree.write(serverFilePath, `// This file should be used to export ONLY server-code from the library.`);
    const baseTsConfig = (0, js_1.getRootTsConfigPathInTree)(tree);
    (0, devkit_1.updateJson)(tree, baseTsConfig, (json) => {
        if (json.compilerOptions.paths &&
            json.compilerOptions.paths[options.importPath]) {
            json.compilerOptions.paths[(0, devkit_1.joinPathFragments)(options.importPath, 'server')] = [serverFilePath];
        }
        return json;
    });
}
exports.addTsconfigEntryPoints = addTsconfigEntryPoints;
