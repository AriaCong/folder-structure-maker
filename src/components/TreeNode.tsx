import React, { useState } from 'react'
import { NodeModel } from '../models/node.model'
import { useTreeNodeControl } from '../hooks/useTreeNodeControl'
import folderIcon from '../assets/folder-open-regular.svg'
import fileIcon from '../assets/file-regular.svg'
import yesIconDark from '../assets/check-dark.svg'
import noIconLight from '../assets/xmark-light.svg'
import addIconDark from '../assets/plus-dark.svg'
import deleteIconDark from '../assets/trash-dark.svg'
import styles from './TreeNode.module.scss'

interface TreeNodeProps {
  node: NodeModel
  depth?: number
  parentNode?: NodeModel
}

const TreeNode: React.FC<TreeNodeProps> = ({ node, depth = 0, parentNode }) => {
  const {
    inputType,
    inputValue,
    setInputValue,
    isEditing,
    addChildNode,
    saveNode,
    deleteNode,
    typeSelector,
    childTypeSelector,
  } = useTreeNodeControl(node, parentNode)
  const [isHoever, setIsHoever] = useState(false)

  return (
    <li
      className={`${depth !== 0 && styles.treeNodeContainerLine} ${
        styles.treeNodeContainer
      }`}
    >
      <div
        className={`${styles.treeNodeWrapper} ${
          isHoever && !isEditing ? styles.treeNodeHover : ''
        }`}
        onMouseEnter={() => setIsHoever(true)}
        onMouseLeave={() => setIsHoever(false)}
      >
        {isEditing ? (
          <div className={styles.inputContainer}>
            <img
              className={styles.icon}
              src={inputType === 'file' ? fileIcon : folderIcon}
              alt={inputType === 'file' ? 'File' : 'Folder'}
            />
            <input
              autoFocus
              className={styles.input}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button onClick={saveNode} className={styles.actionBtnBlack}>
              <img src={yesIconDark} alt="Yes" width={20} />
            </button>
            <button onClick={deleteNode} className={styles.actionBtnWhite}>
              <img src={noIconLight} alt="No" width={20} />
            </button>
          </div>
        ) : (
          <>
            {
              <div
                className={`${depth !== 0 && styles.nodeContainerLine} ${
                  styles.nodeContainer
                }`}
              >
                {node.type === 'file' ? (
                  <img src={fileIcon} alt="file" className={styles.icon} />
                ) : (
                  <img
                    src={folderIcon}
                    alt={'Folder'}
                    className={styles.icon}
                  />
                )}
                {node.name}
              </div>
            }
            {isHoever && (
              <div className={styles.actionBtnContainer}>
                {node.type === 'folder' && (
                  <button
                    onClick={() => addChildNode()}
                    className={styles.actionBtnRound}
                  >
                    <img src={addIconDark} alt="Add" />
                  </button>
                )}
                <button onClick={deleteNode} className={styles.actionBtnRound}>
                  <img src={deleteIconDark} alt="Delete" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
      {node.children && node.children.length > 0 && (
        <ul>
          {node.children.map((child) => {
            return (
              <TreeNode
                key={child.id}
                node={child}
                depth={depth + 1}
                parentNode={node}
              />
            )
          })}
        </ul>
      )}
      {typeSelector === node.id && (
        <div style={depth > 0 ? { paddingLeft: `${depth}px` } : {}}>
          <button
            className={styles.nodeTypeBtn}
            onClick={() => childTypeSelector('folder')}
          >
            Folder
          </button>
          <button
            className={styles.nodeTypeBtn}
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
