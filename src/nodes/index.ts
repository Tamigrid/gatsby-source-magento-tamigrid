import { SourceNodesArgs } from 'gatsby'
import {
  ICategoryWithNodeId,
  IStore,
  MagentoPluginOptions,
} from '../../types/interface'
import { createCategoryNodes } from './categories'
import { createProductNodes } from './products'
import createStoreNode from './storeConfig'

const createMagentoNodes = async (
  context: SourceNodesArgs,
  options: MagentoPluginOptions
) => {
  const storeData = (await createStoreNode(context, options)) as IStore
  const categoryMap = (await createCategoryNodes(
    context,
    options,
    storeData
  )) as Record<string, ICategoryWithNodeId>

  await createProductNodes(context, options, categoryMap)
}

export default createMagentoNodes
