import { useState, DragEventHandler, DragEvent } from 'react'
import styles from './TreeNode.module.scss'
import useTreeNodeService from '../hooks/useTreeNodeService'
import { NodeModel } from '../models/node.model'
import { TreeNodeEdit } from './TreeNodeEdit'
import folderIcon from '../assets/folder-open-regular.svg'
import fileIcon from '../assets/file-regular.svg'
import addIconDark from '../assets/plus-dark.svg'
import deleteIconDark from '../assets/trash-dark.svg'
import addIconLight from '../assets/plus-light.svg'
// the idea is that TreeNode renders one node, and if it has children, it can recursively render more TreeNodes from within
interface TreeNodeProps {
  node: NodeModel // it is a single node not an array of nodes
  parentNode?: NodeModel
  depth?: number
  isDisabled?: boolean
}

const TreeNode: React.FC<TreeNodeProps> = ({
  node,
  parentNode,
  depth = 0,
  isDisabled,
}) => {
  const {
    treeArray,
    setTreeArray,
    handleSaveNode,
    handleDeleteOrCancelNode,
    handleAddNode,
    editingNodeId,
    nodeTypeSelect,
    childTypeSelector,
    draggingNode,
    setDraggingNode,
    draggingNodeParentNode,
    setDraggingNodeParentNode,
    isEditing,
    isHighlighting,
  } = useTreeNodeService(node, parentNode)
  const [isHover, setIsHover] = useState(false)
  const [isRenaming, setIsRenaming] = useState(false)
  const [isExpanded, setIsExpanded] = useState(true)
  const [isDragging, setIsDragging] = useState(false)

  const handleDoubleClick = () => {
    setIsExpanded((prev) => !prev) // Toggle the state
  }

  const indentationStyle = (depth: number) => {
    return depth > 0 ? { paddingLeft: `${depth * 5}px` } : undefined
  }

  const handleOnDrag: DragEventHandler<HTMLDivElement> = (
    e: DragEvent<HTMLDivElement>
  ) => {
    setDraggingNode(node)
    setIsDragging(true)
    parentNode && setDraggingNodeParentNode(parentNode)
  }
  const handleOnDrop: DragEventHandler<HTMLDivElement> = (
    e: DragEvent<HTMLDivElement>
  ) => {
    if (
      draggingNode?.id === node.id ||
      !draggingNode ||
      node.type === 'file' ||
      isDisabled
    ) {
      setDraggingNode(null)
      setIsDragging(false)
      setDraggingNodeParentNode(null)
      return
    }

    const hasDuplicateName = node.children?.some(
      (child) => child.name === draggingNode.name
    )

    if (hasDuplicateName) {
      alert('A node with the same name already exists in this folder.')
      setDraggingNode(null)
      setIsDragging(false)
      setDraggingNodeParentNode(null)
      return
    }

    let newTree = [...treeArray]
    // 1. check if the node has parent, if yes, fillter it out from the parent node
    if (draggingNodeParentNode) {
      console.log('draggingNodeParentNode', draggingNodeParentNode)
      draggingNodeParentNode.children = draggingNodeParentNode.children?.filter(
        (child) => child.id !== draggingNode.id
      )
    } else {
      newTree = newTree?.filter((child) => child.id !== draggingNode.id)
      console.log('newTree', newTree)
    }
    node.children = [...(node?.children ?? []), draggingNode]
    setTreeArray(newTree)
    setDraggingNode(null)
    setDraggingNodeParentNode(null)
    setIsDragging(false)
  }
  const handleOnDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }
  /*
  The dragover event is fired continuously when a draggable element is being dragged over a valid drop target.
  By default, HTML elements do not allow drop operations. To enable dropping, 
  you must prevent the default behavior during dragover
  Otherwise, your ondrop handler will never fire.
  */

  return (
    <li className={styles.treeNodeContainer} style={indentationStyle(depth)}>
      <div
        className={isHover && !isEditing ? styles.treeNodeHover : ''}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        {isEditing ? (
          <TreeNodeEdit
            nodeIcon={node.type === 'folder' ? folderIcon : fileIcon}
            nodeName={node.name || ''}
            onSave={handleSaveNode}
            onCancel={handleDeleteOrCancelNode}
          />
        ) : (
          <>
            <div
              className={styles.treeNodeItemContainer}
              draggable={true}
              onDrag={handleOnDrag}
              onDrop={handleOnDrop}
              onDragOver={handleOnDragOver}
            >
              {node.type === 'folder' ? (
                <>
                  <button
                    className={styles.collapseBtn}
                    onClick={handleDoubleClick}
                  >
                    {isExpanded ? '-' : '+'}
                  </button>
                  <img src={folderIcon} alt="folder" className={styles.icon} />
                </>
              ) : (
                <>
                  <button className={styles.placeholder}></button>
                  <img src={fileIcon} alt="file" className={styles.icon} />
                </>
              )}
              <div
                className={`${
                  isHighlighting && !isRenaming && styles.highlight
                } `}
                onDoubleClick={() => {
                  setIsRenaming(true)
                  setIsHover(false)
                }}
              >
                {isRenaming ? ( // callback function review
                  <TreeNodeEdit
                    nodeName={node.name || ''}
                    onSave={(input) => {
                      handleSaveNode(input)
                      setIsRenaming(false)
                    }}
                    onCancel={
                      node.name
                        ? () => setIsRenaming(false)
                        : handleDeleteOrCancelNode
                    }
                  />
                ) : (
                  node.name
                )}
              </div>
            </div>
            {isHover && !editingNodeId && (
              <div className={styles.actionBtnContainer}>
                {node.type === 'folder' && (
                  <button className={styles.actionBtn} onClick={handleAddNode}>
                    <img src={addIconDark} alt="add" />
                  </button>
                )}
                <button
                  className={styles.actionBtn}
                  onClick={handleDeleteOrCancelNode}
                >
                  <img src={deleteIconDark} alt="delete" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
      {node.children && node.children.length > 0 && isExpanded && (
        <ul>
          {node.children.map((child) => {
            return (
              <TreeNode
                key={child.id}
                node={child} // loop the chrildre array and pass the child node to the TreeNode component
                parentNode={node} // pass the parent node to the child
                depth={depth + 1}
                isDisabled={isDragging || isDisabled}
              />
            )
          })}
        </ul>
      )}
      {nodeTypeSelect === node.id && (
        //   <div style={indentationStyle(depth)}>
        <div>
          <button
            className={styles.typeSelectionBtn}
            onClick={() => childTypeSelector('folder')}
          >
            Folder
          </button>
          <button
            className={styles.typeSelectionBtn}
            onClick={() => childTypeSelector('file')}
          >
            File
          </button>
        </div>
      )}
    </li>
  )
}

export default TreeNode
