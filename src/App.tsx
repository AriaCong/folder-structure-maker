import React from 'react'
import Header from './components/Header'
import { TreeContextProvider } from './context/TreeContext'
import TreeView from './components/TreeView'
import JsonViewer from './components/JsonViewer'

function App(): React.ReactElement {
  return (
    <div className="App">
      <Header />
      <TreeContextProvider>
        <TreeView />
        <JsonViewer />
      </TreeContextProvider>
    </div>
  )
}

export default App
