import { SourceNodesArgs } from 'gatsby';
import { MagentoPluginOptions } from '../../types/interface';
declare const createMagentoNodes: (context: SourceNodesArgs, options: MagentoPluginOptions) => Promise<void>;
export default createMagentoNodes;
