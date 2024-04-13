"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addV2ErrorBoundary = void 0;
const devkit_1 = require("@nx/devkit");
const insert_import_1 = require("../../../utils/insert-import");
const insert_statement_after_imports_1 = require("../../../utils/insert-statement-after-imports");
function addV2ErrorBoundary(tree, options) {
    (0, insert_import_1.insertImport)(tree, options.path, `useRouteError`, '@remix-run/react');
    (0, insert_import_1.insertImport)(tree, options.path, `isRouteErrorResponse`, '@remix-run/react');
    (0, insert_statement_after_imports_1.insertStatementAfterImports)(tree, options.path, (0, devkit_1.stripIndents) `
    export function ErrorBoundary() {
        const error = useRouteError();

        // when true, this is what used to go to 'CatchBoundary'
        if (isRouteErrorResponse(error)) {
            return (
                <div>
                    <h1>Oops</h1>
                    <p>Status: {error.status}</p>
                    <p>{error.data.message}</p>
                </div>
            );
        } else if (error instanceof Error) {
            return (
                <div>
                    <h1>Error</h1>
                    <p>{error.message}</p>
                    <p>The stack trace is:</p>
                    <pre>{error.stack}</pre>
                </div>
            );
        } else {
            return <h1>Unknown Error</h1>;
        }
    }
  `);
}
exports.addV2ErrorBoundary = addV2ErrorBoundary;
