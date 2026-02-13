"use client"

import { useState } from "react"
import { X, Settings } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export interface BlockData {
  id: string
  type: "method" | "module"
  name: string
  description: string
  position: { x: number; y: number }
  ready?: boolean
  stepNumber?: string
}

interface PipelinePropertiesPanelProps {
  block: BlockData | null
  onUpdateBlock: (id: string, data: Partial<BlockData>) => void
  onClose: () => void
}

export function PipelinePropertiesPanel({ block, onUpdateBlock, onClose }: PipelinePropertiesPanelProps) {
  const [name, setName] = useState(block?.name || "")
  const [description, setDescription] = useState(block?.description || "")
  const [ready, setReady] = useState(block?.ready || false)

  // Save changes
  const handleSave = () => {
    if (!block) return

    onUpdateBlock(block.id, {
      name,
      description,
      ready,
    })
  }

  // Toggle ready status
  const handleReadyToggle = (checked: boolean) => {
    setReady(checked)
    if (block) {
      onUpdateBlock(block.id, { ready: checked })
    }
  }

  // Update local state when block changes
  if (block && (block.name !== name || block.description !== description || block.ready !== ready)) {
    setName(block.name)
    setDescription(block.description)
    setReady(block.ready || false)
  }

  if (!block) return null

  return (
    <div className="w-full h-full border-l border-gray-200 bg-white p-4 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Settings className="h-4 w-4 mr-2" />
          <h3 className="font-medium">Block Properties</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-sm hover:bg-gray-100 text-gray-500"
          aria-label="Close properties panel"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-4 flex-1 overflow-auto">
        <div>
          <label htmlFor="block-name" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <Input id="block-name" value={name} onChange={(e) => setName(e.target.value)} className="w-full" />
        </div>

        <div>
          <label htmlFor="block-description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <Textarea
            id="block-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full min-h-[100px]"
          />
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <Switch id="ready-status" checked={ready} onCheckedChange={handleReadyToggle} />
          <Label htmlFor="ready-status" className="font-medium">
            Mark as Ready
          </Label>
        </div>

        <div className="pt-2">
          <p className="text-xs text-gray-500 mb-1">Block Type</p>
          <p className="text-sm font-medium">{block.type === "method" ? "Method" : "Module"}</p>
        </div>

        {block.stepNumber && (
          <div className="pt-2">
            <p className="text-xs text-gray-500 mb-1">Step Number</p>
            <p className="text-sm font-medium">{block.stepNumber}</p>
          </div>
        )}

        <div className="pt-2">
          <p className="text-xs text-gray-500 mb-1">Position</p>
          <div className="flex space-x-2">
            <div>
              <p className="text-xs text-gray-500">X</p>
              <p className="text-sm">{Math.round(block.position.x)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Y</p>
              <p className="text-sm">{Math.round(block.position.y)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200 mt-4">
        <Button onClick={handleSave} className="w-full bg-black hover:bg-gray-800">
          Save Changes
        </Button>
      </div>
    </div>
  )
}
