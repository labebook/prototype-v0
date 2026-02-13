"use client"

import type React from "react"

import { X } from "lucide-react"

export interface ConnectionProps {
  id: string
  sourcePosition: { x: number; y: number }
  targetPosition: { x: number; y: number }
  onDelete: (id: string) => void
  isSelected: boolean
  onSelect: (id: string) => void
}

export function PipelineConnection({
  id,
  sourcePosition,
  targetPosition,
  onDelete,
  isSelected,
  onSelect,
}: ConnectionProps) {
  // Calculate the path for the connection
  const path = `M ${sourcePosition.x} ${sourcePosition.y} C ${sourcePosition.x + 50} ${sourcePosition.y}, ${targetPosition.x - 50} ${targetPosition.y}, ${targetPosition.x} ${targetPosition.y}`

  // Calculate the control points for the bezier curve
  const cp1x = sourcePosition.x + 50
  const cp1y = sourcePosition.y
  const cp2x = targetPosition.x - 50
  const cp2y = targetPosition.y

  // Calculate a point along the bezier curve for the delete button
  // Using the formula for a point on a cubic bezier curve at t=0.5 (midpoint)
  const t = 0.5
  const deleteButtonX =
    Math.pow(1 - t, 3) * sourcePosition.x +
    3 * Math.pow(1 - t, 2) * t * cp1x +
    3 * (1 - t) * Math.pow(t, 2) * cp2x +
    Math.pow(t, 3) * targetPosition.x

  const deleteButtonY =
    Math.pow(1 - t, 3) * sourcePosition.y +
    3 * Math.pow(1 - t, 2) * t * cp1y +
    3 * (1 - t) * Math.pow(t, 2) * cp2y +
    Math.pow(t, 3) * targetPosition.y

  // Handle click on connection
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onSelect(id)
  }

  // Handle delete
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete(id)
  }

  return (
    <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
      <defs>
        <marker id={`arrowhead-${id}`} markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill={isSelected ? "#2563eb" : "#94a3b8"} />
        </marker>
      </defs>

      {/* Connection Path */}
      <path
        d={path}
        stroke={isSelected ? "#2563eb" : "#94a3b8"}
        strokeWidth={isSelected ? "3" : "2"}
        fill="none"
        markerEnd={`url(#arrowhead-${id})`}
        className="pointer-events-auto cursor-pointer"
        onClick={handleClick}
      />

      {/* Delete Button - Only show when connection is selected */}
      {isSelected && (
        <g
          className="pointer-events-auto cursor-pointer"
          onClick={handleDelete}
          transform={`translate(${deleteButtonX}, ${deleteButtonY})`}
        >
          <circle cx="0" cy="0" r="12" fill="white" stroke="#ef4444" strokeWidth="1.5" />
          <X size={16} x="-8" y="-8" color="#ef4444" />
        </g>
      )}
    </svg>
  )
}
