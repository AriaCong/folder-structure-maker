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
