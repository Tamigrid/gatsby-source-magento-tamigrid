import { GraphQLClient } from 'graphql-request'
import { SourceNodesArgs } from 'gatsby'
import camelcaseObjectDeep from 'camelcase-object-deep'
import { createRemoteFileNode } from 'gatsby-source-filesystem'

import productsQuery from './queries/products'
import { MAGENTO_PRODUCT_NODE_TYPE, MAX_PAGE_SIZE } from './utils/constants'
import {
  ICategoryWithNodeId,
  MagentoPluginOptions,
} from '../../types/interface'

interface IMedia {
  label?: string
  url?: string
  url___NODE?: string
}

interface IProductAttribute {
  code: string
  label: string
  valueIndex: number
}
interface IProductVariant {
  attributes: IProductAttribute[]
  product: IProduct
}

interface IProduct {
  uid: string
  image?: IMedia
  smallImage?: IMedia
  thumbnail?: IMedia
  mediaGallery: IMedia[]
  typename: string
  variants?: IProductVariant[]
  relatedProducts?: IProduct[]
  relatedProducts___NODE?: string[]
  crosssellProducts?: IProduct[]
  crosssellProducts___NODE?: string[]
  upsellProducts?: IProduct[]
  upsellProducts___NODE?: string[]
}

interface IProductList {
  items: IProduct[]
}

export const createProductNodes = (
  context: SourceNodesArgs,
  { graphqlEndpoint, storeViewName }: MagentoPluginOptions,
  categoryMap: Record<string, ICategoryWithNodeId>
) => {
  const { reporter } = context

  return new Promise(async (resolve, _reject) => {
    const client = new GraphQLClient(graphqlEndpoint, {
      headers: { Store: storeViewName },
    })

    const activity = reporter.activityTimer(`load Magento products`)
    const bar = reporter.createProgress('Downloading products')

    activity.start()
    bar.start()

    try {
      await fetchMagentoProducts(client, context, 1, categoryMap)

      bar.end ? bar.end() : bar.done()
      activity.end()

      resolve(null)
    } catch (e) {
      reporter.panic(`Failed to fetch Magento Products: ${e}`)
    }
  })
}

const fetchMagentoProducts = async (
  client: GraphQLClient,
  context: SourceNodesArgs,
  currentPage: number,
  categoryMap: Record<string, ICategoryWithNodeId>
) => {
  const { actions, createNodeId, createContentDigest, cache } = context
  const { createNode } = actions
  const productsCacheKey = `magento-products-${currentPage}`

  let productListData: IProductList = await cache.get(productsCacheKey)

  if (!productListData) {
    const { products }: { products: IProductList } = await client.request(
      productsQuery,
      {
        currentPage,
        pageSize: MAX_PAGE_SIZE,
      }
    )

    productListData = products
    await cache.set(productsCacheKey, productListData)
  }

  for (const productData of productListData.items) {
    const nodeId = createNodeId(
      `${MAGENTO_PRODUCT_NODE_TYPE}-${productData.uid}`
    )
    const product = camelcaseObjectDeep(productData) as IProduct

    if (product?.image?.url) {
      const fileNode = await createRemoteFileNode({
        url: product.image.url as string,
        parentNodeId: nodeId,
        createNode,
        createNodeId,
        cache,
      })

      if (fileNode) {
        delete product.image.url

        product.image.url___NODE = fileNode.id
      }
    }

    if (product?.smallImage?.url) {
      const fileNode = await createRemoteFileNode({
        url: product.smallImage.url as string,
        parentNodeId: nodeId,
        createNode,
        createNodeId,
        cache,
      })

      if (fileNode) {
        delete product.smallImage.url

        product.smallImage.url___NODE = fileNode.id
      }
    }

    if (product?.thumbnail?.url) {
      const fileNode = await createRemoteFileNode({
        url: product.thumbnail.url as string,
        parentNodeId: nodeId,
        createNode,
        createNodeId,
        cache,
      })

      if (fileNode) {
        delete product.thumbnail.url

        product.thumbnail.url___NODE = fileNode.id
      }
    }

    if (product?.mediaGallery) {
      const fileNodes = await Promise.all(
        product.mediaGallery.map((media) =>
          createRemoteFileNode({
            url: media.url as string,
            parentNodeId: nodeId,
            createNode,
            createNodeId,
            cache,
          })
        )
      )

      if (fileNodes) {
        product.mediaGallery = product.mediaGallery.map(
          (media: { url?: string; url___NODE?: string }, index: number) => {
            delete media.url

            media.url___NODE = fileNodes[index].id

            return media
          }
        )
      }
    }

    if (product?.relatedProducts) {
      product.relatedProducts___NODE = product.relatedProducts.map(({ uid }) =>
        createNodeId(`${MAGENTO_PRODUCT_NODE_TYPE}-${uid}`)
      )

      delete product.relatedProducts
    }

    if (product?.crosssellProducts) {
      product.crosssellProducts___NODE = product.crosssellProducts.map(
        ({ uid }) => createNodeId(`${MAGENTO_PRODUCT_NODE_TYPE}-${uid}`)
      )

      delete product.crosssellProducts
    }

    if (product?.upsellProducts) {
      product.upsellProducts___NODE = product.upsellProducts.map(({ uid }) =>
        createNodeId(`${MAGENTO_PRODUCT_NODE_TYPE}-${uid}`)
      )

      delete product.upsellProducts
    }

    if (product.typename === 'ConfigurableProduct' && product?.variants) {
      const fileNodes = await Promise.all(
        product.variants.map(async (variant) => {
          const image = await createRemoteFileNode({
            url: variant.product.image?.url as string,
            parentNodeId: nodeId,
            createNode,
            createNodeId,
            cache,
          })

          const mediaGallery = await Promise.all(
            variant.product.mediaGallery.map((media) =>
              createRemoteFileNode({
                url: media.url as string,
                parentNodeId: nodeId,
                createNode,
                createNodeId,
                cache,
              })
            )
          )

          return { image, mediaGallery }
        })
      )

      if (fileNodes) {
        product.variants = product.variants.map(
          (variant: IProductVariant, index: number) => {
            delete variant.product.image?.url

            if (variant.product.image) {
              variant.product.image.url___NODE = fileNodes[index].image?.id
            }

            variant.product.mediaGallery?.map(
              (
                media: { url?: string; url___NODE?: string },
                galleryIndex: number
              ) => {
                delete media.url

                media.url___NODE =
                  fileNodes[index]?.mediaGallery?.[galleryIndex]?.id

                return media
              }
            )

            return variant
          }
        )
      }
    }

    createNode({
      ...product,
      id: nodeId,
      internal: {
        type: MAGENTO_PRODUCT_NODE_TYPE,
        content: JSON.stringify(product),
        contentDigest: createContentDigest(product),
      },
    })
  }

  if (productListData.items.length === MAX_PAGE_SIZE) {
    await fetchMagentoProducts(client, context, currentPage + 1, categoryMap)
  }
}
