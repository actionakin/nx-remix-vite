"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultExport = void 0;
const typescript_1 = require("typescript");
function getDefaultExport(tree, path) {
    const contents = tree.read(path, 'utf-8');
    const sourceFile = (0, typescript_1.createSourceFile)(path, contents, typescript_1.ScriptTarget.ESNext);
    const functionDeclarations = sourceFile.statements.filter(typescript_1.isFunctionDeclaration);
    return functionDeclarations.find((functionDeclaration) => {
        const isDefault = functionDeclaration.modifiers.find((mod) => mod.kind === typescript_1.SyntaxKind.DefaultKeyword);
        const isExport = functionDeclaration.modifiers.find((mod) => mod.kind === typescript_1.SyntaxKind.ExportKeyword);
        return isDefault && isExport;
    });
}
exports.getDefaultExport = getDefaultExport;
