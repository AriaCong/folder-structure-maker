import React, { useContext } from 'react'
import styles from './JsonViewer.module.scss'
import { TreeContext } from '../context/TreeContext'

const JsonViewer: React.FC = () => {
  const context = useContext(TreeContext)
  if (!context) {
    throw new Error('TreeView must be used within a TreeContextProvider')
  }
  const { treeArray } = context
  return (
    <div className={styles.jsonViewWrapper}>
      <h2 className={styles.title}>Folder Structure JSON Viewer</h2>
      <textarea
        readOnly
        className={styles.textarea}
        value={JSON.stringify(treeArray, null, 2)}
      />
    </div>
  )
}
export default JsonViewer
