import styles from './JsonViewer.module.scss'
import { useTreeContext } from '../contexts/TreeContext'
import { useEffect, useState } from 'react'

const JsonViewer: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true)
  const { treeArray, setTreeArray } = useTreeContext()

  // Save data to local storage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('treeArray', JSON.stringify(treeArray))
    }
  }, [treeArray])

  // Get data from local storage
  useEffect(() => {
    const data = localStorage.getItem('treeArray')
    if (data) {
      setTreeArray(JSON.parse(data))
    }
    setIsLoading(false)
  }, [])

  const handleDownload = () => {
    const fileContent = `export TreeArray from ${JSON.stringify(
      treeArray,
      null,
      2
    )}`
    const blob = new Blob([fileContent], { type: 'text/javascript' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'treeArray.js'
    a.click()
    URL.revokeObjectURL(url)
  }
  return (
    <div className={styles.jsonViewerContainer}>
      <h2 className={styles.title}>JSON Viewer</h2>
      <button className={styles.downloadBtn} onClick={handleDownload}>
        Download Json
      </button>
      <textarea
        readOnly
        className={styles.jsonViewer}
        value={JSON.stringify(useTreeContext().treeArray, null, 2)}
      />
    </div>
  )
}

export default JsonViewer
