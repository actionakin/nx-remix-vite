"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const devkit_1 = require("@nx/devkit");
const upsert_links_function_1 = require("../../utils/upsert-links-function");
const versions_1 = require("../../utils/versions");
const lib_1 = require("./lib");
async function setupTailwind(tree, options) {
    const project = (0, devkit_1.readProjectConfiguration)(tree, options.project);
    if (project.projectType !== 'application') {
        throw new Error(`Project "${options.project}" is not an application. Please ensure the project is an application.`);
    }
    (0, lib_1.updateRemixConfig)(tree, project.root);
    (0, devkit_1.generateFiles)(tree, (0, devkit_1.joinPathFragments)(__dirname, 'files'), project.root, {
        tpl: '',
    });
    if (options.js) {
        tree.rename((0, devkit_1.joinPathFragments)(project.root, 'app/root.js'), (0, devkit_1.joinPathFragments)(project.root, 'app/root.tsx'));
    }
    const pathToRoot = (0, devkit_1.joinPathFragments)(project.root, 'app/root.tsx');
    (0, upsert_links_function_1.upsertLinksFunction)(tree, pathToRoot, 'twStyles', './tailwind.css', `{ rel: "stylesheet", href: twStyles }`);
    (0, devkit_1.addDependenciesToPackageJson)(tree, {
        tailwindcss: versions_1.tailwindVersion,
    }, {});
    if (options.js) {
        (0, devkit_1.toJS)(tree);
    }
    if (!options.skipFormat) {
        await (0, devkit_1.formatFiles)(tree);
    }
    return () => {
        (0, devkit_1.installPackagesTask)(tree);
    };
}
exports.default = setupTailwind;
