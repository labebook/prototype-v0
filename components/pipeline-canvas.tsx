"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { PipelineBlock } from "./pipeline-block"
import { PipelineConnection } from "./pipeline-connection"
import { Plus } from "lucide-react"

export interface BlockData {
  id: string
  type: "method" | "module"
  name: string
  description: string
  position: { x: number; y: number }
  ready?: boolean
  stepNumber?: string
}

export interface ConnectionData {
  id: string
  sourceId: string
  targetId: string
}

interface PipelineCanvasProps {
  blocks: BlockData[]
  connections: ConnectionData[]
  onAddBlock: (block: BlockData) => void
  onUpdateBlock: (id: string, data: Partial<BlockData>) => void
  onRemoveBlock: (id: string) => void
  onAddConnection: (connection: ConnectionData) => void
  onRemoveConnection: (id: string) => void
  onSelectBlock: (id: string | null) => void
  selectedBlockId: string | null
}

export function PipelineCanvas({
  blocks,
  connections,
  onAddBlock,
  onUpdateBlock,
  onRemoveBlock,
  onAddConnection,
  onRemoveConnection,
  onSelectBlock,
  selectedBlockId,
}: PipelineCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [draggedConnection, setDraggedConnection] = useState<{
    startBlockId: string
    startHandle: string
    startX: number
    startY: number
    endX: number
    endY: number
  } | null>(null)
  const [selectedConnectionId, setSelectedConnectionId] = useState<string | null>(null)

  // Calculate step numbers based on connections and positions
  useEffect(() => {
    if (blocks.length === 0) return

    // Sort blocks by position (top-to-bottom, left-to-right)
    const sortedBlocks = [...blocks].sort((a, b) => {
      // Use a grid-based approach - divide canvas into rows
      const rowHeight = 150 // Approximate height of a block plus margin
      const rowA = Math.floor(a.position.y / rowHeight)
      const rowB = Math.floor(b.position.y / rowHeight)

      if (rowA !== rowB) return rowA - rowB
      return a.position.x - b.position.x
    })

    // Build a graph of connections
    const graph: Record<string, string[]> = {}
    const incomingEdges: Record<string, number> = {}

    // Initialize
    sortedBlocks.forEach((block) => {
      graph[block.id] = []
      incomingEdges[block.id] = 0
    })

    // Add connections
    connections.forEach((conn) => {
      if (graph[conn.sourceId]) {
        graph[conn.sourceId].push(conn.targetId)
        incomingEdges[conn.targetId] = (incomingEdges[conn.targetId] || 0) + 1
      }
    })

    // Find root nodes (no incoming connections)
    const roots = sortedBlocks.filter((block) => incomingEdges[block.id] === 0).map((block) => block.id)

    // Assign step numbers using topological traversal
    const visited = new Set<string>()
    const stepNumbers: Record<string, string> = {}

    function assignStepNumbers(nodeId: string, prefix = "", index = 0) {
      if (visited.has(nodeId)) return
      visited.add(nodeId)

      // Assign step number
      const stepNumber = prefix ? `${prefix}.${index + 1}` : `${index + 1}`
      stepNumbers[nodeId] = stepNumber

      // Process children
      graph[nodeId].forEach((childId, childIndex) => {
        assignStepNumbers(childId, stepNumber, childIndex)
      })
    }

    // Start with root nodes
    roots.forEach((rootId, rootIndex) => {
      assignStepNumbers(rootId, "", rootIndex)
    })

    // Handle disconnected nodes
    let disconnectedIndex = 1
    sortedBlocks.forEach((block) => {
      if (!visited.has(block.id)) {
        stepNumbers[block.id] = `D${disconnectedIndex}`
        disconnectedIndex++
      }
    })

    // Update blocks with step numbers
    blocks.forEach((block) => {
      const newStepNumber = stepNumbers[block.id]
      if (newStepNumber !== block.stepNumber) {
        onUpdateBlock(block.id, { stepNumber: newStepNumber })
      }
    })
  }, [blocks, connections, onUpdateBlock])

  // Handle dropping a block onto the canvas
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()

    try {
      // Get the data from the drag event
      const data = JSON.parse(e.dataTransfer.getData("application/json"))

      // Calculate the position relative to the canvas
      const canvasRect = canvasRef.current?.getBoundingClientRect()
      if (!canvasRect) return

      const x = e.clientX - canvasRect.left - 128 // Center the block (width/2)
      const y = e.clientY - canvasRect.top - 20 // Adjust for header height

      // Create a new block
      const newBlock: BlockData = {
        id: `${data.id}-${Date.now()}`,
        type: data.type,
        name: data.name,
        description: data.description,
        position: { x, y },
        ready: false,
      }

      onAddBlock(newBlock)
    } catch (error) {
      console.error("Error handling drop:", error)
    }
  }

  // Handle drag over to allow dropping
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  // Handle position change for a block
  const handlePositionChange = (id: string, position: { x: number; y: number }) => {
    onUpdateBlock(id, { position })
  }

  // Handle canvas click to deselect
  const handleCanvasClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement

    // If clicking on the canvas background (not on a block or connection)
    if (target === canvasRef.current || target.classList.contains("canvas-background")) {
      onSelectBlock(null)
      setSelectedConnectionId(null)
    }
  }

  // Handle connection drag start
  const handleConnectionDragStart = (blockId: string, handleType: string, x: number, y: number) => {
    setDraggedConnection({
      startBlockId: blockId,
      startHandle: handleType,
      startX: x,
      startY: y,
      endX: x,
      endY: y,
    })
  }

  // Handle mouse move during connection drag
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedConnection) return

    const canvasRect = canvasRef.current?.getBoundingClientRect()
    if (!canvasRect) return

    setDraggedConnection({
      ...draggedConnection,
      endX: e.clientX - canvasRect.left,
      endY: e.clientY - canvasRect.top,
    })
  }

  // Handle mouse up to complete connection
  const handleMouseUp = (e: React.MouseEvent) => {
    if (!draggedConnection) return

    // Find if we're over a connection handle
    const elementsUnderMouse = document.elementsFromPoint(e.clientX, e.clientY)
    const handleElement = elementsUnderMouse.find((el) => el.classList.contains("connection-handle")) as
      | HTMLElement
      | undefined

    if (handleElement) {
      const targetBlockId = handleElement.getAttribute("data-block-id")
      const targetHandleType = handleElement.getAttribute("data-handle-type")

      if (targetBlockId && targetHandleType && targetBlockId !== draggedConnection.startBlockId) {
        // Only allow connections from right to left or left to right
        if (
          (draggedConnection.startHandle === "right" && targetHandleType === "left") ||
          (draggedConnection.startHandle === "left" && targetHandleType === "right")
        ) {
          // Determine source and target based on handle types
          let sourceId, targetId
          if (draggedConnection.startHandle === "right") {
            sourceId = draggedConnection.startBlockId
            targetId = targetBlockId
          } else {
            sourceId = targetBlockId
            targetId = draggedConnection.startBlockId
          }

          // Check if connection already exists
          const connectionExists = connections.some((conn) => conn.sourceId === sourceId && conn.targetId === targetId)

          if (!connectionExists) {
            // Create a new connection
            const newConnection: ConnectionData = {
              id: `connection-${Date.now()}`,
              sourceId,
              targetId,
            }
            onAddConnection(newConnection)
          }
        }
      }
    }

    // Reset dragged connection state
    setDraggedConnection(null)
  }

  // Calculate connection positions based on block positions
  const getConnectionPositions = (connection: ConnectionData) => {
    const sourceBlock = blocks.find((b) => b.id === connection.sourceId)
    const targetBlock = blocks.find((b) => b.id === connection.targetId)

    if (!sourceBlock || !targetBlock) {
      return {
        sourcePosition: { x: 0, y: 0 },
        targetPosition: { x: 0, y: 0 },
      }
    }

    // Calculate the position of the right handle of the source block
    const sourceX = sourceBlock.position.x + 256 // Block width
    const sourceY = sourceBlock.position.y + 40 // Adjusted for new layout

    // Calculate the position of the left handle of the target block
    const targetX = targetBlock.position.x
    const targetY = targetBlock.position.y + 40 // Adjusted for new layout

    return {
      sourcePosition: { x: sourceX, y: sourceY },
      targetPosition: { x: targetX, y: targetY },
    }
  }

  // Handle connection selection
  const handleConnectionSelect = (id: string) => {
    setSelectedConnectionId(id === selectedConnectionId ? null : id)
  }

  return (
    <div
      ref={canvasRef}
      className="canvas-background relative w-full h-full bg-gray-50 overflow-auto cursor-default"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={handleCanvasClick}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Render connections */}
      {connections.map((connection) => {
        const { sourcePosition, targetPosition } = getConnectionPositions(connection)
        return (
          <PipelineConnection
            key={connection.id}
            id={connection.id}
            sourcePosition={sourcePosition}
            targetPosition={targetPosition}
            onDelete={onRemoveConnection}
            isSelected={selectedConnectionId === connection.id}
            onSelect={handleConnectionSelect}
          />
        )
      })}

      {/* Render blocks */}
      {blocks.map((block) => (
        <PipelineBlock
          key={block.id}
          id={block.id}
          type={block.type}
          name={block.name}
          description={block.description}
          position={block.position}
          ready={block.ready}
          stepNumber={block.stepNumber}
          onPositionChange={handlePositionChange}
          onDelete={onRemoveBlock}
          onSelect={onSelectBlock}
          isSelected={selectedBlockId === block.id}
          onConnectionDragStart={handleConnectionDragStart}
        />
      ))}

      {/* Render the connection being dragged */}
      {draggedConnection && (
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 10 }}>
          <defs>
            <marker id="temp-arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
            </marker>
          </defs>
          <path
            d={`M ${draggedConnection.startX} ${draggedConnection.startY} C ${
              draggedConnection.startHandle === "right" ? draggedConnection.startX + 50 : draggedConnection.startX - 50
            } ${draggedConnection.startY}, ${
              draggedConnection.startHandle === "right" ? draggedConnection.endX - 50 : draggedConnection.endX + 50
            } ${draggedConnection.endY}, ${draggedConnection.endX} ${draggedConnection.endY}`}
            stroke="#3b82f6"
            strokeWidth="3"
            strokeDasharray="5,5"
            fill="none"
            markerEnd="url(#temp-arrowhead)"
          />
        </svg>
      )}

      {/* Empty state placeholder */}
      {blocks.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Plus className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-lg font-medium text-gray-800">Start Building Your Pipeline</p>
          <p className="text-sm text-gray-500 mt-1">Drag methods from the sidebar to add them</p>
          <p className="text-xs text-gray-400 mt-1">Once added, you can drag blocks to rearrange them</p>
        </div>
      )}
    </div>
  )
}
