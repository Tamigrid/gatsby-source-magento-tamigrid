"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_request_1 = require("graphql-request");
const storeConfig_1 = __importDefault(require("./queries/storeConfig"));
const camelcase_object_deep_1 = __importDefault(require("camelcase-object-deep"));
const constants_1 = require("./utils/constants");
const createStoreNode = ({ actions, createNodeId, reporter, createContentDigest, cache, }, { graphqlEndpoint, storeViewName }) => {
    const { createNode } = actions;
    return new Promise(async (resolve, _reject) => {
        const client = new graphql_request_1.GraphQLClient(graphqlEndpoint, {
            headers: { Store: storeViewName },
        });
        try {
            const storeCacheKey = 'magento-store-config';
            let storeData = await cache.get(storeCacheKey);
            if (!storeData) {
                const { storeConfig } = await client.request(storeConfig_1.default);
                storeData = (0, camelcase_object_deep_1.default)(storeConfig);
                await cache.set(storeCacheKey, storeData);
            }
            createNode(Object.assign(Object.assign({}, storeData), { id: createNodeId(`MagentoStore`), children: [], internal: {
                    type: constants_1.MAGENTO_STORE_NODE_TYPE,
                    content: JSON.stringify(storeData),
                    contentDigest: createContentDigest(storeData),
                } }));
            resolve(storeData);
        }
        catch (e) {
            reporter.panic(`Failed to fetch Magento store config: ${e}`);
        }
    });
};
exports.default = createStoreNode;
//# sourceMappingURL=storeConfig.js.map