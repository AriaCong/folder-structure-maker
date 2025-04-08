import React, { useContext } from 'react'
import TreeNode from './TreeNode'
import { TreeContext } from '../context/TreeContext'
import { NodeModel } from '../models/node.model'
import styles from './TreeView.module.scss'

const TreeView: React.FC = () => {
  const context = useContext(TreeContext)
  if (!context) {
    throw new Error('TreeView must be used within a TreeContextProvider')
  }
  const { treeArray, setTreeArray, editingNodeId, setEditingNodeId } = context
  const handleAddFolder = () => {
    const newNode: NodeModel = {
      id: Date.now().toString(),
      type: 'folder',
      children: [],
    }
    const newTree = [...treeArray, newNode]
    setEditingNodeId(newNode.id)
    setTreeArray(newTree)
  }
  return (
    <div className={styles.viewContainer}>
      <button
        className={styles.viewBtn}
        disabled={editingNodeId !== null}
        onClick={handleAddFolder}
      >
        Add folder to root
      </button>
      {treeArray.length !== 0 && (
        <ul className={styles.viewList}>
          {treeArray.map((node) => (
            <TreeNode key={node.id} node={node} />
          ))}
        </ul>
      )}
    </div>
  )
}
export default TreeView
