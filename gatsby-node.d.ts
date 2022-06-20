import { NodePluginArgs, SourceNodesArgs } from 'gatsby';
import { MagentoPluginOptions } from '../types/interface';
export declare const onPreInit: ({ reporter }: NodePluginArgs) => any;
export declare const sourceNodes: (context: SourceNodesArgs, options: MagentoPluginOptions) => Promise<void>;
