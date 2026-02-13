"use client"

import type React from "react"

import { useState, useRef } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface BlockProps {
  id: string
  type: "method" | "module"
  name: string
  description: string
  position: { x: number; y: number }
  ready?: boolean
  stepNumber?: string
  onPositionChange: (id: string, position: { x: number; y: number }) => void
  onDelete: (id: string) => void
  onSelect: (id: string) => void
  isSelected: boolean
  onConnectionDragStart: (blockId: string, handleType: string, x: number, y: number) => void
}

export function PipelineBlock({
  id,
  type,
  name,
  description,
  position,
  ready = false,
  stepNumber,
  onPositionChange,
  onDelete,
  onSelect,
  isSelected,
  onConnectionDragStart,
}: BlockProps) {
  const [isDragging, setIsDragging] = useState(false)
  const blockRef = useRef<HTMLDivElement>(null)
  const dragStartPos = useRef({ x: 0, y: 0 })
  const blockStartPos = useRef({ x: 0, y: 0 })

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only start dragging if clicking on the card, not on buttons or handles
    if ((e.target as HTMLElement).closest("button") || (e.target as HTMLElement).closest(".connection-handle")) return

    setIsDragging(true)
    dragStartPos.current = { x: e.clientX, y: e.clientY }
    blockStartPos.current = { ...position }

    // Prevent text selection during drag
    e.preventDefault()

    // Add visual feedback
    document.body.style.cursor = "grabbing"
    document.body.style.userSelect = "none"

    // Capture mouse events on the entire document
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)

    // Select this block
    onSelect(id)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return

    const dx = e.clientX - dragStartPos.current.x
    const dy = e.clientY - dragStartPos.current.y

    const newPosition = {
      x: blockStartPos.current.x + dx,
      y: blockStartPos.current.y + dy,
    }

    onPositionChange(id, newPosition)
  }

  const handleMouseUp = () => {
    setIsDragging(false)

    // Reset cursor and selection
    document.body.style.cursor = ""
    document.body.style.userSelect = ""

    document.removeEventListener("mousemove", handleMouseMove)
    document.removeEventListener("mouseup", handleMouseUp)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete(id)
  }

  // Handle connection handle mouse down
  const handleConnectionHandleMouseDown = (e: React.MouseEvent, handleType: string) => {
    e.stopPropagation()

    const handleElement = e.currentTarget as HTMLElement
    const rect = handleElement.getBoundingClientRect()
    const canvasRect = blockRef.current?.parentElement?.getBoundingClientRect()

    if (!canvasRect) return

    const x = rect.left + rect.width / 2 - canvasRect.left
    const y = rect.top + rect.height / 2 - canvasRect.top

    onConnectionDragStart(id, handleType, x, y)
  }

  // Extract numeric ID from the full ID string
  const numericId = id.split("-")[1]?.substring(0, 3) || "0"

  return (
    <div
      ref={blockRef}
      className={cn(
        "pipeline-block absolute bg-white border rounded-md shadow-sm w-64 transition-all duration-200",
        isDragging ? "shadow-lg cursor-grabbing scale-105 z-20" : "cursor-grab",
        isSelected ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200",
      )}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        zIndex: isDragging || isSelected ? 10 : 1,
      }}
      onMouseDown={handleMouseDown}
      onClick={(e) => {
        e.stopPropagation()
        onSelect(id)
      }}
    >
      {/* Block Header - Top Row */}
      <div
        className={cn(
          "px-3 py-2 flex items-center justify-between rounded-t-md",
          type === "method" ? "bg-blue-50" : "bg-green-50",
        )}
      >
        <div className="flex items-center flex-1 min-w-0">
          {/* Drag handle indicator */}
          <div className="mr-2 text-gray-400 opacity-60">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <circle cx="2" cy="2" r="1" />
              <circle cx="6" cy="2" r="1" />
              <circle cx="10" cy="2" r="1" />
              <circle cx="2" cy="6" r="1" />
              <circle cx="6" cy="6" r="1" />
              <circle cx="10" cy="6" r="1" />
              <circle cx="2" cy="10" r="1" />
              <circle cx="6" cy="10" r="1" />
              <circle cx="10" cy="10" r="1" />
            </svg>
          </div>

          {/* Step Number */}
          {stepNumber && <span className="text-gray-600 font-bold mr-2 text-base min-w-[20px]">{stepNumber}.</span>}

          {/* Method Name */}
          <span className="font-medium truncate">{name}</span>
        </div>

        <div className="flex items-center ml-2 flex-shrink-0">
          {/* Status Badge */}
          <span
            className={cn(
              "inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium mr-2",
              ready ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800",
            )}
          >
            {ready ? "Ready" : "Not Ready"}
          </span>

          {/* Delete Button */}
          <button
            onClick={handleDelete}
            className="p-1 rounded-sm hover:bg-white/50 text-gray-500 hover:text-red-500"
            aria-label="Delete"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Body - ID and Description */}
      <div className="px-3 py-2 text-sm">
        <div className="text-xs text-gray-500 mb-1">ID: {numericId}</div>
        <p className="text-gray-700 line-clamp-2">{description}</p>
      </div>

      {/* Connection Handles - Always visible */}
      <div
        className="connection-handle absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gray-400 hover:bg-blue-500 cursor-crosshair flex items-center justify-center shadow-md border-2 border-white"
        data-block-id={id}
        data-handle-type="left"
        onMouseDown={(e) => handleConnectionHandleMouseDown(e, "left")}
      >
        <div className="w-2 h-2 bg-white rounded-full"></div>
      </div>
      <div
        className="connection-handle absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-8 h-8 rounded-full bg-gray-400 hover:bg-blue-500 cursor-crosshair flex items-center justify-center shadow-md border-2 border-white"
        data-block-id={id}
        data-handle-type="right"
        onMouseDown={(e) => handleConnectionHandleMouseDown(e, "right")}
      >
        <div className="w-2 h-2 bg-white rounded-full"></div>
      </div>
    </div>
  )
}
