"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDependencies = void 0;
const devkit_1 = require("@nx/devkit");
const versions_1 = require("../../utils/versions");
function updateDependencies(tree) {
    return (0, devkit_1.addDependenciesToPackageJson)(tree, {
        '@remix-run/node': versions_1.remixVersion,
        '@remix-run/react': versions_1.remixVersion,
        isbot: versions_1.isbotVersion,
        react: versions_1.reactVersion,
        'react-dom': versions_1.reactDomVersion,
    }, {
        '@remix-run/eslint-config': versions_1.remixVersion,
        '@types/react': versions_1.typesReactVersion,
        '@types/react-dom': versions_1.typesReactDomVersion,
        eslint: versions_1.eslintVersion,
        typescript: versions_1.typescriptVersion,
    });
}
exports.updateDependencies = updateDependencies;
