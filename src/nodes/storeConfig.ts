import { GraphQLClient } from 'graphql-request'
import { SourceNodesArgs } from 'gatsby'
import storeConfigQuery from './queries/storeConfig'
import camelcaseObjectDeep from 'camelcase-object-deep'
import { MAGENTO_STORE_NODE_TYPE } from './utils/constants'
import { MagentoPluginOptions } from '../../types/interface'

const createStoreNode = (
  {
    actions,
    createNodeId,
    reporter,
    createContentDigest,
    cache,
  }: SourceNodesArgs,
  { graphqlEndpoint, storeViewName }: MagentoPluginOptions
) => {
  const { createNode } = actions

  return new Promise(async (resolve, _reject) => {
    const client = new GraphQLClient(graphqlEndpoint, {
      headers: { Store: storeViewName },
    })

    try {
      const storeCacheKey = 'magento-store-config'

      let storeData = await cache.get(storeCacheKey)

      if (!storeData) {
        const { storeConfig } = await client.request(storeConfigQuery)
        storeData = camelcaseObjectDeep(storeConfig)

        await cache.set(storeCacheKey, storeData)
      }

      createNode({
        ...storeData,
        id: createNodeId(`MagentoStore`),
        children: [],
        internal: {
          type: MAGENTO_STORE_NODE_TYPE,
          content: JSON.stringify(storeData),
          contentDigest: createContentDigest(storeData),
        },
      })

      resolve(storeData)
    } catch (e) {
      reporter.panic(`Failed to fetch Magento store config: ${e}`)
    }
  })
}

export default createStoreNode
