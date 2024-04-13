"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const devkit_1 = require("@nx/devkit");
const lib_1 = require("./lib");
async function errorBoundaryGenerator(tree, schema) {
    const options = await (0, lib_1.normalizeOptions)(tree, schema);
    (0, lib_1.addV2ErrorBoundary)(tree, options);
    if (!options.skipFormat) {
        await (0, devkit_1.formatFiles)(tree);
    }
}
exports.default = errorBoundaryGenerator;
