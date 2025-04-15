// Node model was given originally for the tree structure
// export class NodeModel {
//     type: 'folder' | 'file' | 'unset' | null;
//     name?: string;
//     children?: NodeModel[];
//     id: string;
// }

export interface NodeModel {
  id: string
  type: 'folder' | 'file' | null
  name?: string
  children?: NodeModel[]
}
