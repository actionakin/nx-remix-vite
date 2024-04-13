"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const v2_impl_1 = require("./lib/v2.impl");
async function default_1(tree, schema) {
    await (0, v2_impl_1.v2MetaGenerator)(tree, schema);
}
exports.default = default_1;
