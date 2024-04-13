"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertStatementInDefaultFunction = void 0;
const devkit_1 = require("@nx/devkit");
const get_default_export_1 = require("./get-default-export");
function insertStatementInDefaultFunction(tree, path, statement) {
    const defaultExport = (0, get_default_export_1.getDefaultExport)(tree, path);
    if (!defaultExport) {
        throw Error('No default export found!');
    }
    const index = defaultExport.body.statements.length > 0
        ? defaultExport.body.statements[0].pos
        : 0;
    const newContents = (0, devkit_1.applyChangesToString)(tree.read(path, 'utf-8'), [
        {
            type: devkit_1.ChangeType.Insert,
            index,
            text: statement,
        },
    ]);
    tree.write(path, newContents);
}
exports.insertStatementInDefaultFunction = insertStatementInDefaultFunction;
