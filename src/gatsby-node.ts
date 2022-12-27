import { NodePluginArgs, SourceNodesArgs } from 'gatsby'
import { MagentoPluginOptions } from '../types/interface'
import createMagentoNodes from './nodes'

export const onPreInit = ({ reporter }: NodePluginArgs) =>
  reporter.info('Loaded gatsby-source-magento-tamigrid')

export const sourceNodes = async (
  context: SourceNodesArgs,
  options: MagentoPluginOptions
) => {
  const { graphqlEndpoint, storeViewName } = options
  const { reporter } = context

  if (!graphqlEndpoint) {
    reporter.panic(
      `You need to pass graphqlEndpoint option to Magento2 source plugin. Example: https://yourstore.com/graphql`
    )

    return
  }

  if (!storeViewName) {
    options.storeViewName = 'default'
  }

  await createMagentoNodes(context, options)

  return
}
