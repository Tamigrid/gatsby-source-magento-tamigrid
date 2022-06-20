"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keysToCamelCase = void 0;
const lodash_1 = require("lodash");
const keysToCamelCase = (obj) => {
    if ((0, lodash_1.isPlainObject)(obj)) {
        const n = {};
        Object.keys(obj).forEach((k) => (n[(0, lodash_1.camelCase)(k)] = (0, exports.keysToCamelCase)(obj[k])));
        return n;
    }
    else if ((0, lodash_1.isArray)(obj)) {
        return obj.map((i) => (0, exports.keysToCamelCase)(i));
    }
    return obj;
};
exports.keysToCamelCase = keysToCamelCase;
//# sourceMappingURL=helpers.js.map