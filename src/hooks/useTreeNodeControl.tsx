import React, { useState, useContext } from 'react'
import { NodeModel } from '../models/node.model'
import { TreeContext } from '../context/TreeContext'

export const useTreeNodeControl = (node: NodeModel, parentNode?: NodeModel) => {
  // State management
  const context = useContext(TreeContext)
  if (!context) {
    throw new Error('TreeView must be used within a TreeContextProvider')
  }
  const { treeArray, setTreeArray, editingNodeId, setEditingNodeId } = context
  const [inputType, setInputType] = useState(node.type || null)
  const [inputValue, setInputValue] = useState(node.name || '')
  const [typeSelector, setTypeSelector] = useState<string | null>(null)

  const isEditing = editingNodeId === node.id
  const validateInput = (input: string): boolean => {
    return input.trim() !== '' && !input.includes(' ')
  }

  const addChildNode = () => {
    setTypeSelector(node.id)
  }

  const childTypeSelector = (nodeType: 'file' | 'folder') => {
    const newNode: NodeModel = {
      id: Date.now().toString(),
      type: nodeType,
      name: '',
      children: nodeType === 'folder' ? [] : undefined,
    }
    node.children = [...(node.children || []), newNode]
    setTreeArray((prev) => [...prev]) // trigger rerndering
    setEditingNodeId(newNode.id)
    setTypeSelector(null)
  }
  const saveNode = () => {
    if (!validateInput(inputValue)) {
      alert('Invalid input')
      return
    }
    node.name = inputValue.trim()
    setEditingNodeId(null)
    setTreeArray((prev) => [...prev]) // trigger rerndering
  }
  const deleteNode = () => {
    if (parentNode) {
      parentNode.children = parentNode.children?.filter(
        (child) => child.id !== node.id
      )
      setTreeArray((prev) => [...prev]) // trigger rerndering
    } else {
      const newTreeArray = treeArray.filter(
        (treeNode) => treeNode.id !== node.id
      )
      setTreeArray(newTreeArray)
    }
  }
  const editNode = () => {}

  return {
    inputType,
    inputValue,
    setInputType,
    setInputValue,
    isEditing,
    addChildNode,
    deleteNode,
    saveNode,
    childTypeSelector,
    typeSelector,
  }
}
