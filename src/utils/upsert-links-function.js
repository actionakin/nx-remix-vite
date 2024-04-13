"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upsertLinksFunction = void 0;
const devkit_1 = require("@nx/devkit");
const tsquery_1 = require("@phenomnomnominal/tsquery");
const insert_import_1 = require("./insert-import");
const insert_statement_after_imports_1 = require("./insert-statement-after-imports");
function upsertLinksFunction(tree, filePath, importName, importPath, linkObject) {
    (0, insert_import_1.insertImport)(tree, filePath, 'LinksFunction', '@remix-run/node', {
        typeOnly: true,
    });
    (0, insert_statement_after_imports_1.insertStatementAfterImports)(tree, filePath, (0, devkit_1.stripIndents) `import ${importName} from "${importPath}";`);
    const fileContents = tree.read(filePath, 'utf-8');
    const LINKS_FUNCTION_SELECTOR = 'VariableDeclaration:has(TypeReference > Identifier[name=LinksFunction])';
    const ast = tsquery_1.tsquery.ast(fileContents);
    const linksFunctionNodes = (0, tsquery_1.tsquery)(ast, LINKS_FUNCTION_SELECTOR, {
        visitAllChildren: true,
    });
    if (linksFunctionNodes.length === 0) {
        (0, insert_statement_after_imports_1.insertStatementAfterImports)(tree, filePath, (0, devkit_1.stripIndents) `export const links: LinksFunction = () => [
  ${linkObject},
];`);
    }
    else {
        const linksArrayNodes = (0, tsquery_1.tsquery)(linksFunctionNodes[0], 'ArrayLiteralExpression', { visitAllChildren: true });
        const arrayNode = linksArrayNodes[0];
        const updatedFileContents = `${fileContents.slice(0, arrayNode.getStart() + 1)}\n${linkObject},${fileContents.slice(arrayNode.getStart() + 1)}`;
        tree.write(filePath, updatedFileContents);
    }
}
exports.upsertLinksFunction = upsertLinksFunction;
