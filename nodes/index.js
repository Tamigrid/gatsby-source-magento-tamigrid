"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const categories_1 = require("./categories");
const products_1 = require("./products");
const storeConfig_1 = __importDefault(require("./storeConfig"));
const createMagentoNodes = async (context, options) => {
    const storeData = (await (0, storeConfig_1.default)(context, options));
    const categoryMap = (await (0, categories_1.createCategoryNodes)(context, options, storeData));
    await (0, products_1.createProductNodes)(context, options, categoryMap);
};
exports.default = createMagentoNodes;
//# sourceMappingURL=index.js.map