"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultExportName = void 0;
const get_default_export_1 = require("./get-default-export");
function getDefaultExportName(tree, path) {
    return (0, get_default_export_1.getDefaultExport)(tree, path)?.name.text ?? 'Unknown';
}
exports.getDefaultExportName = getDefaultExportName;
