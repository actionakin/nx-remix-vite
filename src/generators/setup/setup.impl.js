"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const devkit_1 = require("@nx/devkit");
const js_1 = require("@nx/js");
async function default_1(tree) {
    const tasks = [];
    const jsInitTask = await (0, js_1.initGenerator)(tree, {
        skipFormat: true,
    });
    tasks.push(jsInitTask);
    // Ignore nested project files
    let ignoreFile = tree.read('.gitignore').toString();
    if (ignoreFile.indexOf('/dist') !== -1) {
        ignoreFile = ignoreFile.replace('/dist', 'dist');
    }
    if (ignoreFile.indexOf('/node_modules') !== -1) {
        ignoreFile = ignoreFile.replace('/node_modules', 'node_modules');
    }
    if (ignoreFile.indexOf('# Remix files') === -1) {
        ignoreFile = `${ignoreFile}
# Remix files
apps/**/build
apps/**/.cache
  `;
    }
    tree.write('.gitignore', ignoreFile);
    (0, devkit_1.updateJson)(tree, `package.json`, (json) => {
        json.type = 'module';
        return json;
    });
    await (0, devkit_1.formatFiles)(tree);
    return (0, devkit_1.runTasksInSerial)(...tasks);
}
exports.default = default_1;
