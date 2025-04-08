import React, { createContext, useState, ReactNode } from 'react'
import { NodeModel } from '../models/node.model'

interface TreeContextProps {
  treeArray: NodeModel[]
  setTreeArray: React.Dispatch<React.SetStateAction<NodeModel[]>>
  editingNodeId: string | null
  setEditingNodeId: React.Dispatch<React.SetStateAction<string | null>>
}

export const TreeContext = createContext<TreeContextProps | undefined>(
  undefined
)

export const TreeContextProvider = ({ children }: { children: ReactNode }) => {
  const [treeArray, setTreeArray] = useState<NodeModel[]>([])
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null)
  return (
    <TreeContext.Provider
      value={{ treeArray, setTreeArray, editingNodeId, setEditingNodeId }}
    >
      {children}
    </TreeContext.Provider>
  )
}
