import { SourceNodesArgs } from 'gatsby';
import { ICategoryWithNodeId, MagentoPluginOptions } from '../../types/interface';
export declare const createProductNodes: (context: SourceNodesArgs, { graphqlEndpoint, storeViewName }: MagentoPluginOptions, categoryMap: Record<string, ICategoryWithNodeId>) => Promise<unknown>;
