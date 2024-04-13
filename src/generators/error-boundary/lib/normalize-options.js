"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeOptions = void 0;
const remix_route_utils_1 = require("../../../utils/remix-route-utils");
async function normalizeOptions(tree, schema) {
    const pathToRouteFile = schema.nameAndDirectoryFormat === 'as-provided'
        ? schema.path
        : await (0, remix_route_utils_1.resolveRemixRouteFile)(tree, schema.path, schema.project);
    if (!tree.exists(pathToRouteFile)) {
        throw new Error(`Route file specified does not exist "${pathToRouteFile}". Please ensure you pass a correct path to the file.`);
    }
    return {
        ...schema,
        path: pathToRouteFile,
    };
}
exports.normalizeOptions = normalizeOptions;
