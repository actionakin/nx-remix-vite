"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertImport = void 0;
const devkit_1 = require("@nx/devkit");
const typescript_1 = require("typescript");
const insert_statement_after_imports_1 = require("./insert-statement-after-imports");
function insertImport(tree, path, name, modulePath, options = { typeOnly: false }) {
    if (!tree.exists(path))
        throw Error(`Could not insert import ${name} from ${modulePath} in ${path}: path not found`);
    const contents = tree.read(path, 'utf-8');
    const sourceFile = (0, typescript_1.createSourceFile)(path, contents, typescript_1.ScriptTarget.ESNext);
    let importStatements = sourceFile.statements.filter(typescript_1.isImportDeclaration);
    if (options.typeOnly) {
        importStatements = importStatements.filter((node) => node.importClause.isTypeOnly);
    }
    else {
        importStatements = importStatements.filter((node) => !node.importClause.isTypeOnly);
    }
    const existingImport = importStatements.find((statement) => (0, typescript_1.isStringLiteral)(statement.moduleSpecifier) &&
        statement.moduleSpecifier
            .getText(sourceFile)
            .replace(/['"`]/g, '')
            .trim() === modulePath &&
        statement.importClause.namedBindings &&
        (0, typescript_1.isNamedImports)(statement.importClause.namedBindings));
    if (!existingImport) {
        (0, insert_statement_after_imports_1.insertStatementAfterImports)(tree, path, options.typeOnly
            ? `import type { ${name} } from '${modulePath}';`
            : `import { ${name} } from '${modulePath}';`);
        return;
    }
    const namedImports = existingImport.importClause
        .namedBindings;
    const alreadyImported = namedImports.elements.find((element) => element.name.escapedText === name) !== undefined;
    if (!alreadyImported) {
        const index = namedImports.getEnd() - 1;
        let text;
        if (namedImports.elements.hasTrailingComma) {
            text = `${name},`;
        }
        else {
            text = `,${name}`;
        }
        const newContents = (0, devkit_1.applyChangesToString)(contents, [
            {
                type: devkit_1.ChangeType.Insert,
                index,
                text,
            },
        ]);
        tree.write(path, newContents);
    }
}
exports.insertImport = insertImport;
