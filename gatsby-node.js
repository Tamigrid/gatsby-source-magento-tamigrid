"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sourceNodes = exports.onPreInit = void 0;
const nodes_1 = __importDefault(require("./nodes"));
const onPreInit = ({ reporter }) => reporter.info('Loaded gatsby-source-magento-graphql');
exports.onPreInit = onPreInit;
const sourceNodes = async (context, options) => {
    const { graphqlEndpoint, storeViewName } = options;
    const { reporter } = context;
    if (!graphqlEndpoint) {
        reporter.panic(`You need to pass graphqlEndpoint option to Magento2 source plugin. Example: https://yourstore.com/graphql`);
        return;
    }
    if (!storeViewName) {
        options.storeViewName = 'default';
    }
    await (0, nodes_1.default)(context, options);
    return;
};
exports.sourceNodes = sourceNodes;
//# sourceMappingURL=gatsby-node.js.map