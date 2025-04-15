import React from 'react'
import TreeView from './components/TreeView'
import Header from './components/Header'
import { TreeContextProvider } from './contexts/TreeContext'
import JsonViewer from './components/JsonViewer'

function App() {
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
