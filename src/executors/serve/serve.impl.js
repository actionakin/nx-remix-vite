"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const devkit_1 = require("@nx/devkit");
const async_iterable_1 = require("@nx/devkit/src/utils/async-iterable");
const wait_for_port_open_1 = require("@nx/web/src/utils/wait-for-port-open");
const node_child_process_1 = require("node:child_process");
const node_path_1 = require("node:path");
const versions_1 = require("../../utils/versions");
function normalizeOptions(schema) {
    return {
        ...schema,
        port: schema.port ?? 4200,
        debug: schema.debug ?? false,
        manual: schema.manual ?? false,
    };
}
function buildRemixDevArgs(options) {
    const args = [];
    // TODO this might be deprecated
    if (options.command) {
        args.push(`--command=${options.command}`);
    }
    if (options.devServerPort) {
        args.push(`--port=${options.devServerPort}`);
    }
    if (options.debug) {
        args.push(`--debug`);
    }
    if (options.manual) {
        args.push(`--manual`);
    }
    if (options.tlsKey) {
        args.push(`--tls-key=${options.tlsKey}`);
    }
    if (options.tlsCert) {
        args.push(`--tls-cert=${options.tlsCert}`);
    }
    return args;
}
async function* serveExecutor(schema, context) {
    const options = normalizeOptions(schema);
    const projectRoot = context.workspace.projects[context.projectName].root;
    const remixBin = require.resolve('@remix-run/dev/dist/cli');
    const args = buildRemixDevArgs(options);
    // Cast to any to overwrite NODE_ENV
    process.env.NODE_ENV = process.env.NODE_ENV
        ? process.env.NODE_ENV
        : 'development';
    process.env.PORT = `${options.port}`;
    const bundlerType = (0, versions_1.getBunlderType)(projectRoot);
    const serveTargetName = bundlerType === 'vite' ? 'vite:dev' : 'dev';
    yield* (0, async_iterable_1.createAsyncIterable)(async ({ done, next, error }) => {
        const server = (0, node_child_process_1.fork)(remixBin, [serveTargetName, ...args], {
            cwd: (0, node_path_1.join)(devkit_1.workspaceRoot, projectRoot),
            stdio: 'inherit',
        });
        server.once('exit', (code) => {
            if (code === 0) {
                done();
            }
            else {
                error(new Error(`Remix app exited with code ${code}`));
            }
        });
        const killServer = () => {
            if (server.connected) {
                server.kill('SIGTERM');
            }
        };
        process.on('exit', () => killServer());
        process.on('SIGINT', () => killServer());
        process.on('SIGTERM', () => killServer());
        process.on('SIGHUP', () => killServer());
        await (0, wait_for_port_open_1.waitForPortOpen)(options.port);
        next({
            success: true,
            baseUrl: `http://localhost:${options.port}`,
        });
    });
}
exports.default = serveExecutor;
