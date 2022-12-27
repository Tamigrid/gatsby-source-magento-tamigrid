"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProductNodes = void 0;
const graphql_request_1 = require("graphql-request");
const camelcase_object_deep_1 = __importDefault(require("camelcase-object-deep"));
const gatsby_source_filesystem_1 = require("gatsby-source-filesystem");
const products_1 = __importDefault(require("./queries/products"));
const constants_1 = require("./utils/constants");
const createProductNodes = (context, { graphqlEndpoint, storeViewName }, categoryMap) => {
    const { reporter } = context;
    return new Promise(async (resolve, _reject) => {
        const client = new graphql_request_1.GraphQLClient(graphqlEndpoint, {
            headers: { Store: storeViewName },
        });
        const activity = reporter.activityTimer(`load Magento products`);
        const bar = reporter.createProgress('Downloading products');
        activity.start();
        bar.start();
        try {
            await fetchMagentoProducts(client, context, 1, categoryMap);
            bar.end ? bar.end() : bar.done();
            activity.end();
            resolve(null);
        }
        catch (e) {
            reporter.panic(`Failed to fetch Magento Products: ${e}`);
        }
    });
};
exports.createProductNodes = createProductNodes;
const fetchMagentoProducts = async (client, context, currentPage, categoryMap) => {
    var _a, _b, _c;
    const { actions, createNodeId, createContentDigest, cache } = context;
    const { createNode } = actions;
    const productsCacheKey = `magento-products-${currentPage}`;
    let productListData = await cache.get(productsCacheKey);
    if (!productListData) {
        const { products } = await client.request(products_1.default, {
            currentPage,
            pageSize: constants_1.MAX_PAGE_SIZE,
        });
        productListData = products;
        await cache.set(productsCacheKey, productListData);
    }
    for (const productData of productListData.items) {
        const nodeId = createNodeId(`${constants_1.MAGENTO_PRODUCT_NODE_TYPE}-${productData.uid}`);
        const product = (0, camelcase_object_deep_1.default)(productData);
        if ((_a = product === null || product === void 0 ? void 0 : product.image) === null || _a === void 0 ? void 0 : _a.url) {
            const fileNode = await (0, gatsby_source_filesystem_1.createRemoteFileNode)({
                url: product.image.url,
                parentNodeId: nodeId,
                createNode,
                createNodeId,
                cache,
            });
            if (fileNode) {
                delete product.image.url;
                product.image.url___NODE = fileNode.id;
            }
        }
        if ((_b = product === null || product === void 0 ? void 0 : product.smallImage) === null || _b === void 0 ? void 0 : _b.url) {
            const fileNode = await (0, gatsby_source_filesystem_1.createRemoteFileNode)({
                url: product.smallImage.url,
                parentNodeId: nodeId,
                createNode,
                createNodeId,
                cache,
            });
            if (fileNode) {
                delete product.smallImage.url;
                product.smallImage.url___NODE = fileNode.id;
            }
        }
        if ((_c = product === null || product === void 0 ? void 0 : product.thumbnail) === null || _c === void 0 ? void 0 : _c.url) {
            const fileNode = await (0, gatsby_source_filesystem_1.createRemoteFileNode)({
                url: product.thumbnail.url,
                parentNodeId: nodeId,
                createNode,
                createNodeId,
                cache,
            });
            if (fileNode) {
                delete product.thumbnail.url;
                product.thumbnail.url___NODE = fileNode.id;
            }
        }
        if (product === null || product === void 0 ? void 0 : product.mediaGallery) {
            const fileNodes = await Promise.all(product.mediaGallery.map((media) => (0, gatsby_source_filesystem_1.createRemoteFileNode)({
                url: media.url,
                parentNodeId: nodeId,
                createNode,
                createNodeId,
                cache,
            })));
            if (fileNodes) {
                product.mediaGallery = product.mediaGallery.map((media, index) => {
                    delete media.url;
                    media.url___NODE = fileNodes[index].id;
                    return media;
                });
            }
        }
        if (product === null || product === void 0 ? void 0 : product.relatedProducts) {
            product.relatedProducts___NODE = product.relatedProducts.map(({ uid }) => createNodeId(`${constants_1.MAGENTO_PRODUCT_NODE_TYPE}-${uid}`));
            delete product.relatedProducts;
        }
        if (product === null || product === void 0 ? void 0 : product.crosssellProducts) {
            product.crosssellProducts___NODE = product.crosssellProducts.map(({ uid }) => createNodeId(`${constants_1.MAGENTO_PRODUCT_NODE_TYPE}-${uid}`));
            delete product.crosssellProducts;
        }
        if (product === null || product === void 0 ? void 0 : product.upsellProducts) {
            product.upsellProducts___NODE = product.upsellProducts.map(({ uid }) => createNodeId(`${constants_1.MAGENTO_PRODUCT_NODE_TYPE}-${uid}`));
            delete product.upsellProducts;
        }
        if (product.typename === 'ConfigurableProduct' && (product === null || product === void 0 ? void 0 : product.variants)) {
            const fileNodes = await Promise.all(product.variants.map(async (variant) => {
                var _a;
                const image = await (0, gatsby_source_filesystem_1.createRemoteFileNode)({
                    url: (_a = variant.product.image) === null || _a === void 0 ? void 0 : _a.url,
                    parentNodeId: nodeId,
                    createNode,
                    createNodeId,
                    cache,
                });
                const mediaGallery = await Promise.all(variant.product.mediaGallery.map((media) => (0, gatsby_source_filesystem_1.createRemoteFileNode)({
                    url: media.url,
                    parentNodeId: nodeId,
                    createNode,
                    createNodeId,
                    cache,
                })));
                return { image, mediaGallery };
            }));
            if (fileNodes) {
                product.variants = product.variants.map((variant, index) => {
                    var _a, _b, _c;
                    (_a = variant.product.image) === null || _a === void 0 ? true : delete _a.url;
                    if (variant.product.image) {
                        variant.product.image.url___NODE = (_b = fileNodes[index].image) === null || _b === void 0 ? void 0 : _b.id;
                    }
                    (_c = variant.product.mediaGallery) === null || _c === void 0 ? void 0 : _c.map((media, galleryIndex) => {
                        var _a, _b, _c;
                        delete media.url;
                        media.url___NODE =
                            (_c = (_b = (_a = fileNodes[index]) === null || _a === void 0 ? void 0 : _a.mediaGallery) === null || _b === void 0 ? void 0 : _b[galleryIndex]) === null || _c === void 0 ? void 0 : _c.id;
                        return media;
                    });
                    return variant;
                });
            }
        }
        createNode(Object.assign(Object.assign({}, product), { id: nodeId, internal: {
                type: constants_1.MAGENTO_PRODUCT_NODE_TYPE,
                content: JSON.stringify(product),
                contentDigest: createContentDigest(product),
            } }));
    }
    if (productListData.items.length === constants_1.MAX_PAGE_SIZE) {
        await fetchMagentoProducts(client, context, currentPage + 1, categoryMap);
    }
};
//# sourceMappingURL=products.js.map