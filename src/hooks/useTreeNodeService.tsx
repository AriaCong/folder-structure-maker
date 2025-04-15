import { useState } from 'react'
import { useTreeContext } from '../contexts/TreeContext'
import { NodeModel } from '../models/node.model'

const useTreeNodeService = (node: NodeModel, parentNode?: NodeModel) => {
  const {
    treeArray,
    setTreeArray,
    editingNodeId,
    setEditingNodeId,
    draggingNode,
    setDraggingNode,
    draggingNodeParentNode,
    setDraggingNodeParentNode,
    searchValue,
    setSearchValue,
  } = useTreeContext()
  const [inputType, setInputType] = useState<string | null>('')
  const [nodeTypeSelect, setNodeTypeSelect] = useState<string | null>(null)

  const isEditing = editingNodeId === node.id
  const isHighlighting = node.name === searchValue

  const isValid = (inputValue: string): boolean => {
    if (inputValue.trim().includes(' ') || inputValue.trim() === '') {
      alert('Name cannot be empty or contain spaces')
      return false
    }
    const isDuplicate = (siblings: NodeModel[]): boolean =>
      !!siblings.find((sibling) => sibling.name === inputValue.trim()) // syntax!!!
    if (isDuplicate(parentNode ? parentNode.children ?? [] : treeArray)) {
      alert('Name already exists')
      return false
    }
    return true
  }

  const handleSaveNode = (inputValue: string) => {
    if (!isValid(inputValue)) {
      return
    }
    node.name = inputValue.trim()
    setEditingNodeId(null)
    setTreeArray((prev) => [...prev])
  }

  const handleAddNode = () => {
    setNodeTypeSelect(node.id)
  }

  const handleDeleteOrCancelNode = () => {
    if (parentNode) {
      parentNode.children = parentNode.children?.filter(
        (child) => child.id !== node.id
      )
      console.log('parent node children', parentNode.children)
      setTreeArray((prev) => [...prev])
    } else {
      const newTreeArray = treeArray.filter((child) => child.id !== node.id)
      setTreeArray(newTreeArray)
    }
    setEditingNodeId(null)
  }

  const childTypeSelector = (nodeType: 'file' | 'folder') => {
    const newNode: NodeModel = {
      id: Date.now().toString(),
      name: '',
      type: nodeType,
      children: nodeType === 'folder' ? [] : undefined,
    }

    node.children = [...(node.children || []), newNode]
    setTreeArray((prev) => [...prev]) // trigger rerndering
    setEditingNodeId(newNode.id) // makes that new node enter editing mode
    setNodeTypeSelect(null) // hides the Folder/File buttons again
  }

  return {
    isEditing,
    treeArray,
    setTreeArray,
    editingNodeId,
    setEditingNodeId,
    inputType,
    setInputType,
    handleSaveNode,
    handleDeleteOrCancelNode,
    handleAddNode,
    nodeTypeSelect,
    setNodeTypeSelect,
    childTypeSelector,
    draggingNode,
    setDraggingNode,
    draggingNodeParentNode,
    setDraggingNodeParentNode,
    searchValue,
    setSearchValue,
    isHighlighting,
  }
}

export default useTreeNodeService
