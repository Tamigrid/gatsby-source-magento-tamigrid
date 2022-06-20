import { Interface } from 'readline'

interface MagentoPluginOptions {
  graphqlEndpoint: string
  storeViewName: string
}

interface IStore {
  id: number
  code: string
  websiteId: number
  locale: string
  baseCurrencyCode: string
  defaultDisplayCurrencyCode: string
  timezone: string
  weightUnit: string
  baseUrl: string
  baseLinkUrl: string
  baseStaticUrl: string
  baseMediaUrl: string
  rootCategoryUid: string
  secureBaseUrl: string
  secureBaseLinkUrl: string
  secureBaseMediaUrl: string
}

interface ICategoryRaw {
  uid: string
  children: ICategoryRaw[]
  children_count: number
  parentCategoryUid?: string
  products: ICategoryProduct
}

interface ICategory {
  uid: string
  image?: string
  image___NODE?: string
  parentCategory___NODE?: string
  productDetails: { items___NODE?: string[] }
}

interface IUid {
  uid: string
}

interface ICategoryProduct {
  items: IUid[]
  items___NODE?: string[]
}

interface ICategoryWithNodeId {
  nodeId: string
}
