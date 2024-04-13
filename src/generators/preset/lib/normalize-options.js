"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeOptions = void 0;
function normalizeOptions(_, options) {
    // There is a bug in Nx core where custom preset args are not passed correctly for boolean values, thus causing the name to be "commit" or "nx-cloud" when not passed.
    // TODO(jack): revert this hack once Nx core is fixed for custom preset args.
    // TODO(philip): presets should probably be using the `appName` flag to name the app, but it's not getting passed down to this generator properly and is always an empty string
    const appName = options.name;
    const projectRoot = `packages/${appName}`;
    const parsedTags = options.tags
        ? options.tags.split(',').map((s) => s.trim())
        : [];
    return {
        ...options,
        appName,
        projectRoot,
        parsedTags,
    };
}
exports.normalizeOptions = normalizeOptions;
