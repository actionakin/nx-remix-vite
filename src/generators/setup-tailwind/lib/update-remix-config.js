"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRemixConfig = void 0;
const tsquery_1 = require("@phenomnomnominal/tsquery");
const remix_config_1 = require("../../../utils/remix-config");
function updateRemixConfig(tree, projectRoot) {
    const pathToRemixConfig = (0, remix_config_1.getRemixConfigPathFromProjectRoot)(tree, projectRoot);
    const fileContents = tree.read(pathToRemixConfig, 'utf-8');
    const REMIX_CONFIG_OBJECT_SELECTOR = 'ObjectLiteralExpression';
    const ast = tsquery_1.tsquery.ast(fileContents);
    const nodes = (0, tsquery_1.tsquery)(ast, REMIX_CONFIG_OBJECT_SELECTOR, {
        visitAllChildren: true,
    });
    if (nodes.length === 0) {
        throw new Error(`Remix Config is not valid, unable to update the file.`);
    }
    const configObjectNode = nodes[0];
    const propertyNodes = (0, tsquery_1.tsquery)(configObjectNode, 'PropertyAssignment', {
        visitAllChildren: true,
    });
    for (const propertyNode of propertyNodes) {
        const nodeText = propertyNode.getText();
        if (nodeText.includes('tailwind') && nodeText.includes('true')) {
            return;
        }
        else if (nodeText.includes('tailwind') && nodeText.includes('false')) {
            const updatedFileContents = `${fileContents.slice(0, propertyNode.getStart())}tailwind: true${fileContents.slice(propertyNode.getEnd())}`;
            tree.write(pathToRemixConfig, updatedFileContents);
            return;
        }
    }
    const updatedFileContents = `${fileContents.slice(0, configObjectNode.getStart() + 1)}\ntailwind: true,${fileContents.slice(configObjectNode.getStart() + 1)}`;
    tree.write(pathToRemixConfig, updatedFileContents);
}
exports.updateRemixConfig = updateRemixConfig;
