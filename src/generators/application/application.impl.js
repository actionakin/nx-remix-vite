"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remixApplicationGeneratorInternal = exports.remixApplicationGenerator = void 0;
const devkit_1 = require("@nx/devkit");
const create_ts_config_1 = require("@nx/js/src/utils/typescript/create-ts-config");
const versions_1 = require("../../utils/versions");
const lib_1 = require("./lib");
const update_dependencies_1 = require("../utils/update-dependencies");
const init_1 = require("../init/init");
const js_1 = require("@nx/js");
const add_build_target_defaults_1 = require("@nx/devkit/src/generators/add-build-target-defaults");
const log_show_project_command_1 = require("@nx/devkit/src/utils/log-show-project-command");
const testing_config_utils_1 = require("../../utils/testing-config-utils");
function remixApplicationGenerator(tree, options) {
    return remixApplicationGeneratorInternal(tree, {
        addPlugin: false,
        ...options,
    });
}
exports.remixApplicationGenerator = remixApplicationGenerator;
async function remixApplicationGeneratorInternal(tree, _options) {
    const options = await (0, lib_1.normalizeOptions)(tree, _options);
    const tasks = [
        await (0, init_1.default)(tree, {
            skipFormat: true,
            addPlugin: options.addPlugin,
        }),
        await (0, js_1.initGenerator)(tree, { skipFormat: true }),
    ];
    (0, add_build_target_defaults_1.addBuildTargetDefaults)(tree, '@nx/remix:build');
    (0, devkit_1.addProjectConfiguration)(tree, options.projectName, {
        root: options.projectRoot,
        sourceRoot: `${options.projectRoot}`,
        projectType: 'application',
        tags: options.parsedTags,
        targets: !options.addPlugin
            ? {
                build: {
                    executor: '@nx/remix:build',
                    outputs: ['{options.outputPath}'],
                    options: {
                        outputPath: (0, devkit_1.joinPathFragments)('dist', options.projectRoot),
                    },
                },
                serve: {
                    executor: `@nx/remix:serve`,
                    options: {
                        command: `${(0, devkit_1.getPackageManagerCommand)().exec} remix-serve build/index.js`,
                        manual: true,
                        port: 4200,
                    },
                },
                start: {
                    dependsOn: ['build'],
                    command: `remix-serve build/index.js`,
                    options: {
                        cwd: options.projectRoot,
                    },
                },
                typecheck: {
                    command: `tsc --project tsconfig.app.json`,
                    options: {
                        cwd: options.projectRoot,
                    },
                },
            }
            : {},
    });
    const installTask = (0, update_dependencies_1.updateDependencies)(tree);
    tasks.push(installTask);
    const vars = {
        ...options,
        tmpl: '',
        offsetFromRoot: (0, devkit_1.offsetFromRoot)(options.projectRoot),
        remixVersion: versions_1.remixVersion,
        isbotVersion: versions_1.isbotVersion,
        reactVersion: versions_1.reactVersion,
        reactDomVersion: versions_1.reactDomVersion,
        typesReactVersion: versions_1.typesReactVersion,
        typesReactDomVersion: versions_1.typesReactDomVersion,
        eslintVersion: versions_1.eslintVersion,
        typescriptVersion: versions_1.typescriptVersion,
    };
    (0, devkit_1.generateFiles)(tree, (0, devkit_1.joinPathFragments)(__dirname, 'files/common'), options.projectRoot, vars);
    if (options.rootProject) {
        const gitignore = tree.read('.gitignore', 'utf-8');
        tree.write('.gitignore', `${gitignore}\n.cache\nbuild\npublic/build\n.env\n`);
    }
    else {
        (0, devkit_1.generateFiles)(tree, (0, devkit_1.joinPathFragments)(__dirname, 'files/integrated'), options.projectRoot, vars);
    }
    if (options.unitTestRunner !== 'none') {
        tasks.push(...(await (0, lib_1.addUnitTest)(tree, options)));
    }
    else {
        tree.delete((0, devkit_1.joinPathFragments)(options.projectRoot, `tests/routes/_index.spec.tsx`));
    }
    if (options.linter !== 'none') {
        tasks.push(await (0, lib_1.addLint)(tree, options));
    }
    if (options.js) {
        (0, devkit_1.toJS)(tree);
    }
    if (options.rootProject && tree.exists('tsconfig.base.json')) {
        // If this is a standalone project, merge tsconfig.json and tsconfig.base.json.
        const tsConfigBaseJson = (0, devkit_1.readJson)(tree, 'tsconfig.base.json');
        (0, devkit_1.updateJson)(tree, 'tsconfig.json', (json) => {
            delete json.extends;
            json.compilerOptions = {
                ...tsConfigBaseJson.compilerOptions,
                ...json.compilerOptions,
                // Taken from remix default setup
                // https://github.com/remix-run/remix/blob/68c8982/templates/remix/tsconfig.json#L15-L17
                paths: {
                    '~/*': ['./app/*'],
                },
            };
            json.include = [
                ...(tsConfigBaseJson.include ?? []),
                ...(json.include ?? []),
            ];
            json.exclude = [
                ...(tsConfigBaseJson.exclude ?? []),
                ...(json.exclude ?? []),
            ];
            return json;
        });
        tree.delete('tsconfig.base.json');
    }
    else {
        // Otherwise, extract the tsconfig.base.json from tsconfig.json so we can share settings.
        (0, create_ts_config_1.extractTsConfigBase)(tree);
    }
    if (options.rootProject) {
        (0, devkit_1.updateJson)(tree, `package.json`, (json) => {
            json.type = 'module';
            return json;
        });
        if (options.unitTestRunner === 'jest') {
            tree.write('jest.preset.js', `import { nxPreset } from '@nx/jest/preset/jest-preset.js';
export default {...nxPreset};
`);
            (0, testing_config_utils_1.updateJestTestMatch)(tree, 'jest.config.ts', '<rootDir>/tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}');
        }
    }
    tasks.push(await (0, lib_1.addE2E)(tree, options));
    if (!options.skipFormat) {
        await (0, devkit_1.formatFiles)(tree);
    }
    tasks.push(() => {
        (0, log_show_project_command_1.logShowProjectCommand)(options.projectName);
    });
    return (0, devkit_1.runTasksInSerial)(...tasks);
}
exports.remixApplicationGeneratorInternal = remixApplicationGeneratorInternal;
exports.default = remixApplicationGenerator;
