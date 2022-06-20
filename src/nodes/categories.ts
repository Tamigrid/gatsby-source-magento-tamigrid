import { GraphQLClient } from 'graphql-request'
import { SourceNodesArgs, NodeInput, Node } from 'gatsby'
import categoriesQuery from './queries/categories'
import categoryProductsQuery from './queries/category_products'
import camelcaseObjectDeep from 'camelcase-object-deep'
import {
  MAGENTO_CATEGORY_NODE_TYPE,
  MAGENTO_PRODUCT_NODE_TYPE,
  MAX_PAGE_SIZE,
} from './utils/constants'
import { createRemoteFileNode } from 'gatsby-source-filesystem'
import {
  ICategory,
  ICategoryProduct,
  ICategoryRaw,
  IStore,
  IUid,
  MagentoPluginOptions,
} from '../../types/interface'

const categoryMap: Record<string, NodeInput> = {}

export const createCategoryNodes = (
  context: SourceNodesArgs,
  { graphqlEndpoint, storeViewName }: MagentoPluginOptions,
  { rootCategoryUid }: IStore
) => {
  const { reporter } = context

  return new Promise(async (resolve, _reject) => {
    const client = new GraphQLClient(graphqlEndpoint, {
      headers: { Store: storeViewName },
    })

    const activity = reporter.activityTimer(`load Magento categories`)
    const bar = reporter.createProgress('Downloading categories')

    activity.start()
    bar.start()

    try {
      await fetchMagentoCategories(client, context, [rootCategoryUid], null)

      bar.end ? bar.end() : bar.done()
      activity.end()

      resolve(categoryMap)
    } catch (e) {
      reporter.panic(`Failed to fetch Magento store config: ${e}`)
    }
  })
}

const fetchCategoryProducts = async (
  client: GraphQLClient,
  context: SourceNodesArgs,
  uid: string,
  currentPage: number,
  results: IUid[]
): Promise<{ items___NODE?: string[] }> => {
  const { createNodeId, cache } = context

  const cacheKey = `magento-category-products-${uid}-${currentPage}`

  let categoryProducts = await cache.get(cacheKey)

  if (!categoryProducts) {
    categoryProducts = await client.request(categoryProductsQuery, {
      uid,
      currentPage,
    })

    await cache.set(cacheKey, categoryProducts)
  }

  if (categoryProducts?.length >= MAX_PAGE_SIZE) {
    return fetchCategoryProducts(client, context, uid, currentPage + 1, [
      ...results,
      ...categoryProducts,
    ])
  } else {
    const { products = { items: [], items___NODE: [] } } = camelcaseObjectDeep(
      categoryProducts
    ) as {
      products: ICategoryProduct
    }
    const { items, ...rest } = products

    rest.items___NODE = [...results, ...items].map(({ uid }) =>
      createNodeId(`${MAGENTO_PRODUCT_NODE_TYPE}-${uid}`)
    )

    return rest
  }
}

const fetchMagentoCategories = async (
  client: GraphQLClient,
  context: SourceNodesArgs,
  categoryUids: string[],
  parentNode: Node | null
) => {
  const { actions, createNodeId, createContentDigest, cache } = context
  const { createNode, createParentChildLink } = actions
  const categoriesCacheKey = `magento-categories-${JSON.stringify(
    categoryUids
  )}`

  let categoryListData: ICategoryRaw[] = await cache.get(categoriesCacheKey)

  if (!categoryListData) {
    const { categoryList }: { categoryList: ICategoryRaw[] } =
      await client.request(categoriesQuery, {
        categoryUids,
      })

    categoryListData = categoryList

    await cache.set(categoriesCacheKey, categoryList)
  }

  for (const category of categoryListData) {
    const { children: categoryChildren, ...rest } = category
    let categoryData: ICategory = camelcaseObjectDeep(rest) as ICategory
    const nodeId = createNodeId(
      `${MAGENTO_CATEGORY_NODE_TYPE}-${categoryData.uid}`
    )

    if (categoryData.image) {
      const fileNode = await createRemoteFileNode({
        url: categoryData.image as string,
        parentNodeId: nodeId,
        createNode,
        createNodeId,
        cache,
      })

      if (fileNode) {
        delete categoryData.image

        categoryData.image___NODE = fileNode.id
      }
    }

    const products = await fetchCategoryProducts(
      client,
      context,
      categoryData.uid,
      1,
      []
    )
    categoryData = {
      ...categoryData,
      productDetails: { ...products },
    }

    const node: NodeInput = {
      ...categoryData,
      id: nodeId,
      children: [],
      products: [],
      parent: parentNode?.id,
      internal: {
        type: MAGENTO_CATEGORY_NODE_TYPE,
        content: JSON.stringify(categoryData),
        contentDigest: createContentDigest(categoryData),
      },
    }

    categoryMap[categoryData.uid] = node

    createNode(node)

    if (parentNode) {
      createParentChildLink({ parent: parentNode, child: node })
    }

    if (category.children.length > 0) {
      const uids = category.children.map(({ uid }) => uid).sort()

      await fetchMagentoCategories(client, context, uids, node as Node)
    }
  }
}
