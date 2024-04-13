"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const devkit_1 = require("@nx/devkit");
const insert_import_1 = require("../../utils/insert-import");
const insert_statement_after_imports_1 = require("../../utils/insert-statement-after-imports");
const insert_statement_in_default_function_1 = require("../../utils/insert-statement-in-default-function");
const remix_route_utils_1 = require("../../utils/remix-route-utils");
async function default_1(tree, schema) {
    const routeFilePath = schema.nameAndDirectoryFormat === 'as-provided'
        ? schema.path
        : await (0, remix_route_utils_1.resolveRemixRouteFile)(tree, schema.path, schema.project);
    if (!tree.exists(routeFilePath)) {
        throw new Error(`Route path does not exist: ${routeFilePath}. Please generate a Remix route first.`);
    }
    (0, insert_import_1.insertImport)(tree, routeFilePath, 'useLoaderData', '@remix-run/react');
    (0, insert_import_1.insertImport)(tree, routeFilePath, 'json', '@remix-run/node');
    (0, insert_import_1.insertImport)(tree, routeFilePath, 'LoaderFunctionArgs', '@remix-run/node', {
        typeOnly: true,
    });
    (0, insert_statement_after_imports_1.insertStatementAfterImports)(tree, routeFilePath, `
    export const loader = async ({request}: LoaderFunctionArgs ) => {
      return json({
        message: 'Hello, world!',
      })
    };

    `);
    const statement = `\nconst data = useLoaderData<typeof loader>();`;
    try {
        (0, insert_statement_in_default_function_1.insertStatementInDefaultFunction)(tree, routeFilePath, statement);
        // eslint-disable-next-line no-empty
    }
    catch (err) {
    }
    finally {
        await (0, devkit_1.formatFiles)(tree);
    }
}
exports.default = default_1;
