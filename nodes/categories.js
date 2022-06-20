"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCategoryNodes = void 0;
const graphql_request_1 = require("graphql-request");
const categories_1 = __importDefault(require("./queries/categories"));
const category_products_1 = __importDefault(require("./queries/category_products"));
const camelcase_object_deep_1 = __importDefault(require("camelcase-object-deep"));
const constants_1 = require("./utils/constants");
const gatsby_source_filesystem_1 = require("gatsby-source-filesystem");
const categoryMap = {};
const createCategoryNodes = (context, { graphqlEndpoint, storeViewName }, { rootCategoryUid }) => {
    const { reporter } = context;
    return new Promise(async (resolve, _reject) => {
        const client = new graphql_request_1.GraphQLClient(graphqlEndpoint, {
            headers: { Store: storeViewName },
        });
        const activity = reporter.activityTimer(`load Magento categories`);
        const bar = reporter.createProgress('Downloading categories');
        activity.start();
        bar.start();
        try {
            await fetchMagentoCategories(client, context, [rootCategoryUid], null);
            bar.end ? bar.end() : bar.done();
            activity.end();
            resolve(categoryMap);
        }
        catch (e) {
            reporter.panic(`Failed to fetch Magento store config: ${e}`);
        }
    });
};
exports.createCategoryNodes = createCategoryNodes;
const fetchCategoryProducts = async (client, context, uid, currentPage, results) => {
    const { createNodeId, cache } = context;
    const cacheKey = `magento-category-products-${uid}-${currentPage}`;
    let categoryProducts = await cache.get(cacheKey);
    if (!categoryProducts) {
        categoryProducts = await client.request(category_products_1.default, {
            uid,
            currentPage,
        });
        await cache.set(cacheKey, categoryProducts);
    }
    if ((categoryProducts === null || categoryProducts === void 0 ? void 0 : categoryProducts.length) >= constants_1.MAX_PAGE_SIZE) {
        return fetchCategoryProducts(client, context, uid, currentPage + 1, [
            ...results,
            ...categoryProducts,
        ]);
    }
    else {
        const { products = { items: [], items___NODE: [] } } = (0, camelcase_object_deep_1.default)(categoryProducts);
        const { items } = products, rest = __rest(products, ["items"]);
        rest.items___NODE = [...results, ...items].map(({ uid }) => createNodeId(`${constants_1.MAGENTO_PRODUCT_NODE_TYPE}-${uid}`));
        return rest;
    }
};
const fetchMagentoCategories = async (client, context, categoryUids, parentNode) => {
    const { actions, createNodeId, createContentDigest, cache } = context;
    const { createNode, createParentChildLink } = actions;
    const categoriesCacheKey = `magento-categories-${JSON.stringify(categoryUids)}`;
    let categoryListData = await cache.get(categoriesCacheKey);
    if (!categoryListData) {
        const { categoryList } = await client.request(categories_1.default, {
            categoryUids,
        });
        categoryListData = categoryList;
        await cache.set(categoriesCacheKey, categoryList);
    }
    for (const category of categoryListData) {
        const { children: categoryChildren } = category, rest = __rest(category, ["children"]);
        let categoryData = (0, camelcase_object_deep_1.default)(rest);
        const nodeId = createNodeId(`${constants_1.MAGENTO_CATEGORY_NODE_TYPE}-${categoryData.uid}`);
        if (categoryData.image) {
            const fileNode = await (0, gatsby_source_filesystem_1.createRemoteFileNode)({
                url: categoryData.image,
                parentNodeId: nodeId,
                createNode,
                createNodeId,
                cache,
            });
            if (fileNode) {
                delete categoryData.image;
                categoryData.image___NODE = fileNode.id;
            }
        }
        const products = await fetchCategoryProducts(client, context, categoryData.uid, 1, []);
        categoryData = Object.assign(Object.assign({}, categoryData), { productDetails: Object.assign({}, products) });
        const node = Object.assign(Object.assign({}, categoryData), { id: nodeId, children: [], products: [], parent: parentNode === null || parentNode === void 0 ? void 0 : parentNode.id, internal: {
                type: constants_1.MAGENTO_CATEGORY_NODE_TYPE,
                content: JSON.stringify(categoryData),
                contentDigest: createContentDigest(categoryData),
            } });
        categoryMap[categoryData.uid] = node;
        createNode(node);
        if (parentNode) {
            createParentChildLink({ parent: parentNode, child: node });
        }
        if (category.children.length > 0) {
            const uids = category.children.map(({ uid }) => uid).sort();
            await fetchMagentoCategories(client, context, uids, node);
        }
    }
};
//# sourceMappingURL=categories.js.map