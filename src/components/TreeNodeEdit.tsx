import { useState } from 'react'
import yesIconDark from '../assets/check-dark.svg'
import noIconLight from '../assets/xmark-light.svg'
import styles from './TreeNodeEdit.module.scss'

interface TreeNodeEditProps {
  nodeIcon?: string
  nodeName: string
  onSave: (inputValue: string) => void
  onCancel: () => void
}

export const TreeNodeEdit: React.FC<TreeNodeEditProps> = ({
  nodeIcon,
  nodeName,
  onSave,
  onCancel,
}) => {
  const [inputValue, setInputValue] = useState(nodeName || '')
  return (
    <div className={styles.inputContainer}>
      {nodeIcon && (
        <img className={styles.icon} src={nodeIcon} alt={nodeIcon} />
      )}
      <input
        autoFocus
        className={styles.input}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button className={styles.darkButton} onClick={() => onSave(inputValue)}>
        <img src={yesIconDark} alt="yes" className={styles.icon} />
      </button>
      <button className={styles.lightButton} onClick={onCancel}>
        <img src={noIconLight} alt="no" className={styles.icon} />
      </button>
    </div>
  )
}
