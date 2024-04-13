"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const devkit_1 = require("@nx/devkit");
const artifact_name_and_directory_utils_1 = require("@nx/devkit/src/generators/artifact-name-and-directory-utils");
const path_1 = require("path");
const insert_import_1 = require("../../utils/insert-import");
const insert_statement_after_imports_1 = require("../../utils/insert-statement-after-imports");
const remix_route_utils_1 = require("../../utils/remix-route-utils");
async function default_1(tree, options) {
    const { project: projectName, artifactName: name } = await (0, artifact_name_and_directory_utils_1.determineArtifactNameAndDirectoryOptions)(tree, {
        artifactType: 'style',
        callingGenerator: '@nx/remix:style',
        name: options.path,
        nameAndDirectoryFormat: options.nameAndDirectoryFormat,
        project: options.project,
    });
    const project = (0, devkit_1.readProjectConfiguration)(tree, projectName);
    if (!project)
        throw new Error(`Project does not exist: ${projectName}`);
    const appDir = await (0, remix_route_utils_1.resolveRemixAppDirectory)(tree, project.name);
    const normalizedRoutePath = `${(0, remix_route_utils_1.normalizeRoutePath)(options.path)
        .replace(/^\//, '')
        .replace('.tsx', '')}.css`;
    const stylesheetPath = (0, devkit_1.joinPathFragments)(appDir, 'styles', normalizedRoutePath);
    tree.write(stylesheetPath, (0, devkit_1.stripIndents) `
      :root {
        --color-foreground: #fff;
        --color-background: #143157;
        --color-links: hsl(214, 73%, 69%);
        --color-border: #275da8;
        --font-body: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
          Liberation Mono, Courier New, monospace;
      }
    `);
    const routeFilePath = options.nameAndDirectoryFormat
        ? options.path
        : await (0, remix_route_utils_1.resolveRemixRouteFile)(tree, options.path, options.project, '.tsx');
    (0, insert_import_1.insertImport)(tree, routeFilePath, 'LinksFunction', '@remix-run/node', {
        typeOnly: true,
    });
    if (project.root === '.') {
        (0, insert_statement_after_imports_1.insertStatementAfterImports)(tree, routeFilePath, `
    import stylesUrl from '~/styles/${normalizedRoutePath}'

    export const links: LinksFunction = () => {
      return [{ rel: 'stylesheet', href: stylesUrl }];
    };
  `);
    }
    else {
        (0, insert_statement_after_imports_1.insertStatementAfterImports)(tree, routeFilePath, `
    import stylesUrl from '${(0, path_1.relative)((0, path_1.dirname)(routeFilePath), stylesheetPath)}';

    export const links: LinksFunction = () => {
      return [{ rel: 'stylesheet', href: stylesUrl }];
    };
  `);
    }
    await (0, devkit_1.formatFiles)(tree);
}
exports.default = default_1;
