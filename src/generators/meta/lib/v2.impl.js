"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.v2MetaGenerator = void 0;
const devkit_1 = require("@nx/devkit");
const get_default_export_name_1 = require("../../../utils/get-default-export-name");
const insert_import_1 = require("../../../utils/insert-import");
const insert_statement_after_imports_1 = require("../../../utils/insert-statement-after-imports");
const remix_route_utils_1 = require("../../../utils/remix-route-utils");
async function v2MetaGenerator(tree, schema) {
    const routeFilePath = schema.nameAndDirectoryFormat === 'as-provided'
        ? schema.path
        : await (0, remix_route_utils_1.resolveRemixRouteFile)(tree, schema.path, schema.project);
    if (!tree.exists(routeFilePath)) {
        throw new Error(`Route path does not exist: ${routeFilePath}. Please generate a Remix route first.`);
    }
    (0, insert_import_1.insertImport)(tree, routeFilePath, 'MetaFunction', '@remix-run/node', {
        typeOnly: true,
    });
    const defaultExportName = (0, get_default_export_name_1.getDefaultExportName)(tree, routeFilePath);
    (0, insert_statement_after_imports_1.insertStatementAfterImports)(tree, routeFilePath, `
    export const meta: MetaFunction = () => {
      return [{ title: '${defaultExportName} Route' }];
    };

    `);
    await (0, devkit_1.formatFiles)(tree);
}
exports.v2MetaGenerator = v2MetaGenerator;
