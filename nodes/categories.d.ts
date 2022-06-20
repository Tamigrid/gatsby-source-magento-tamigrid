import { SourceNodesArgs } from 'gatsby';
import { IStore, MagentoPluginOptions } from '../../types/interface';
export declare const createCategoryNodes: (context: SourceNodesArgs, { graphqlEndpoint, storeViewName }: MagentoPluginOptions, { rootCategoryUid }: IStore) => Promise<unknown>;
