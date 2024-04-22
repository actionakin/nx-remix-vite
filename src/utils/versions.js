"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPackageVersion = exports.getRemixVersion = exports.testingLibraryUserEventsVersion = exports.testingLibraryJestDomVersion = exports.testingLibraryReactVersion = exports.tailwindVersion = exports.typescriptVersion = exports.eslintVersion = exports.typesReactDomVersion = exports.typesReactVersion = exports.reactDomVersion = exports.reactVersion = exports.isbotVersion = exports.remixVersion = exports.nxVersion = void 0;
const devkit_1 = require("@nx/devkit");
exports.nxVersion = require('../../package.json').version;
exports.remixVersion = '^2.8.1';
exports.isbotVersion = '^4.4.0';
exports.reactVersion = '^18.2.0';
exports.reactDomVersion = '^18.2.0';
exports.typesReactVersion = '^18.2.0';
exports.typesReactDomVersion = '^18.2.0';
exports.eslintVersion = '^8.56.0';
exports.typescriptVersion = '^5.3.3';
exports.tailwindVersion = '^3.3.0';
exports.testingLibraryReactVersion = '^14.1.2';
exports.testingLibraryJestDomVersion = '^6.2.0';
exports.testingLibraryUserEventsVersion = '^14.5.2';
function getRemixVersion(tree) {
    return getPackageVersion(tree, '@remix-run/dev') ?? exports.remixVersion;
}
exports.getRemixVersion = getRemixVersion;
function getPackageVersion(tree, packageName) {
    const packageJsonContents = (0, devkit_1.readJson)(tree, 'package.json');
    return (packageJsonContents?.['devDependencies']?.[packageName] ??
        packageJsonContents?.['dependencies']?.[packageName] ??
        null);
}
exports.getPackageVersion = getPackageVersion;
