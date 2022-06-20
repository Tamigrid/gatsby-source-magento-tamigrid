import { SourceNodesArgs } from 'gatsby';
import { MagentoPluginOptions } from '../../types/interface';
declare const createStoreNode: ({ actions, createNodeId, reporter, createContentDigest, cache, }: SourceNodesArgs, { graphqlEndpoint, storeViewName }: MagentoPluginOptions) => Promise<unknown>;
export default createStoreNode;
