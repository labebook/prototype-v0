"use client"

import type React from "react"

import { useState } from "react"
import { Pencil, Save, Share2, Play, LayoutGrid, List, X, Search, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { PipelineCanvas, type BlockData, type ConnectionData } from "./pipeline-canvas"
import { PipelineListView } from "./pipeline-list-view"

export function NewPipelineEditor() {
  const [pipelineName, setPipelineName] = useState("New Pipeline")
  const [isEditingName, setIsEditingName] = useState(false)
  const [showPropertiesPanel, setShowPropertiesPanel] = useState(false)
  const [viewMode, setViewMode] = useState<"visual" | "list">("visual")
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)
  const [sidebarTab, setSidebarTab] = useState<"methods" | "custom-modules">("methods")
  const [searchQuery, setSearchQuery] = useState("")

  // Pipeline state
  const [blocks, setBlocks] = useState<BlockData[]>([])
  const [connections, setConnections] = useState<ConnectionData[]>([])

  // Static library data (items stay visible after being added to the pipeline)
  const allMethods = [
    { id: "rna-isolation", name: "RNA Isolation", description: "Extraction of total RNA from biological samples" },
    { id: "reverse-transcription", name: "Reverse Transcription (RT)", description: "cDNA synthesis from RNA templates" },
    { id: "qpcr", name: "qPCR (Quantitative PCR)", description: "Real-time PCR for quantifying nucleic acids" },
    { id: "endpoint-pcr", name: "End-point PCR", description: "Standard PCR for DNA amplification" },
    { id: "agarose-gel", name: "Agarose Gel Electrophoresis", description: "Separation of DNA or RNA fragments by size" },
    { id: "sds-page", name: "SDS-PAGE", description: "Polyacrylamide gel electrophoresis for protein separation" },
  ]

  const allCustomModules = [
    { id: "CM-001", name: "Whole-Cell Protein Lysate Preparation", description: "Lysate preparation from suspension cells prior to Western blot" },
    { id: "data-analysis", name: "Data Analysis", description: "Statistical analysis of experimental data" },
    { id: "visualization", name: "Visualization", description: "Data visualization tools" },
    { id: "reporting", name: "Reporting", description: "Generate automated reports" },
  ]

  const sidebarItems = sidebarTab === "methods" ? allMethods : allCustomModules
  const filteredItems = searchQuery.trim()
    ? sidebarItems.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : sidebarItems

  // Helper functions for data transformation
  const getCategoryFromType = (type: string) => {
    switch (type) {
      case "RNA Isolation":
        return "Extraction"
      case "Reverse Transcription (RT)":
        return "Synthesis"
      case "qPCR (Quantitative PCR)":
      case "End-point PCR":
        return "Amplification"
      case "Agarose Gel Electrophoresis":
        return "Analysis"
      case "SDS-PAGE":
        return "Separation"
      default:
        return "General"
    }
  }

  const getObjectiveFromType = (type: string) => {
    switch (type) {
      case "RNA Isolation":
        return "Extract total RNA from biological samples"
      case "Reverse Transcription (RT)":
        return "Synthesize cDNA from RNA templates"
      case "qPCR (Quantitative PCR)":
        return "Quantify nucleic acids in real-time"
      case "End-point PCR":
        return "Amplify DNA for downstream analysis"
      case "Agarose Gel Electrophoresis":
        return "Separate DNA/RNA fragments by size"
      case "SDS-PAGE":
        return "Separate proteins by molecular weight"
      default:
        return "Perform laboratory procedure"
    }
  }

  const getMethodFromType = (type: string) => {
    switch (type) {
      case "RNA Isolation":
        return "Column-based or TRIzol extraction"
      case "Reverse Transcription (RT)":
        return "Reverse transcriptase enzyme reaction"
      case "qPCR (Quantitative PCR)":
        return "Real-time PCR with fluorescent detection"
      case "End-point PCR":
        return "Standard PCR amplification"
      case "Agarose Gel Electrophoresis":
        return "Electrophoretic separation in agarose matrix"
      case "SDS-PAGE":
        return "Polyacrylamide gel electrophoresis"
      default:
        return "Standard laboratory protocol"
    }
  }

  // Transform blocks to steps format for list view
  const transformedSteps =
    blocks?.map((block, index) => ({
      step: index + 1,
      name: block.name,
      category: getCategoryFromType(block.name),
      objective: getObjectiveFromType(block.name),
      method: getMethodFromType(block.name),
      ready: block.ready || false,
      id: block.id,
    })) || []

  const handleNameEdit = () => {
    setIsEditingName(true)
  }

  const handleNameSave = () => {
    setIsEditingName(false)
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPipelineName(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleNameSave()
    }
  }

  // Add an item directly to the canvas (click + button)
  const handleAddItem = (item: { id: string; name: string; description: string }, type: "method" | "module") => {
    const col = blocks.length % 3
    const row = Math.floor(blocks.length / 3)
    const block: BlockData = {
      id: `${item.id}-${Date.now()}`,
      type,
      name: item.name,
      description: item.description,
      position: { x: 80 + col * 220, y: 80 + row * 140 },
      ready: false,
    }
    handleAddBlock(block)
  }

  // Make items draggable from the sidebar
  const handleDragStart = (
    e: React.DragEvent,
    item: { id: string; type: "method" | "module"; name: string; description: string },
  ) => {
    e.dataTransfer.setData("application/json", JSON.stringify(item))
    e.dataTransfer.effectAllowed = "copy"
  }

  // Canvas event handlers
  const handleAddBlock = (block: BlockData) => {
    setBlocks([...blocks, block])
    setSelectedBlockId(block.id)
    setShowPropertiesPanel(true)
  }

  const handleUpdateBlock = (id: string, data: Partial<BlockData>) => {
    setBlocks(blocks.map((block) => (block.id === id ? { ...block, ...data } : block)))
  }

  const handleRemoveBlock = (id: string) => {
    setBlocks(blocks.filter((block) => block.id !== id))
    setConnections(connections.filter((conn) => conn.sourceId !== id && conn.targetId !== id))
    if (selectedBlockId === id) {
      setSelectedBlockId(null)
      setShowPropertiesPanel(false)
    }
  }

  const handleAddConnection = (connection: ConnectionData) => {
    // Check if connection already exists
    const exists = connections.some(
      (conn) => conn.sourceId === connection.sourceId && conn.targetId === connection.targetId,
    )

    if (!exists) {
      setConnections([...connections, connection])
    }
  }

  const handleRemoveConnection = (id: string) => {
    setConnections(connections.filter((conn) => conn.id !== id))
  }

  const handleSelectBlock = (id: string | null) => {
    setSelectedBlockId(id)
    setShowPropertiesPanel(!!id)
  }

  const handleReorderBlocks = (newBlocks: BlockData[]) => {
    setBlocks(newBlocks)
  }

  // Get the selected block
  const selectedBlock = blocks.find((block) => block.id === selectedBlockId) || null

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="w-full flex justify-between items-center px-6 h-16">
          <div className="flex items-center">
            {isEditingName ? (
              <Input
                value={pipelineName}
                onChange={handleNameChange}
                onBlur={handleNameSave}
                onKeyDown={handleKeyDown}
                autoFocus
                className="text-2xl font-bold border-none shadow-none focus-visible:ring-0 p-0 h-auto"
              />
            ) : (
              <h1 className="text-2xl font-bold flex items-center">
                {pipelineName}
                <button
                  onClick={handleNameEdit}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                  aria-label="Edit pipeline name"
                >
                  <Pencil className="h-5 w-5" />
                </button>
              </h1>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {/* View toggle */}
            <div className="flex items-center border border-gray-200 rounded-md overflow-hidden mr-2">
              <button
                className={cn(
                  "px-3 py-1.5 flex items-center",
                  viewMode === "visual" ? "bg-gray-100 text-gray-900" : "bg-white text-gray-600",
                )}
                onClick={() => setViewMode("visual")}
              >
                <LayoutGrid className="h-4 w-4 mr-1" />
                <span className="text-sm">Visual</span>
              </button>
              <button
                className={cn(
                  "px-3 py-1.5 flex items-center",
                  viewMode === "list" ? "bg-gray-100 text-gray-900" : "bg-white text-gray-600",
                )}
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4 mr-1" />
                <span className="text-sm">List</span>
              </button>
            </div>

            <Button variant="outline" size="sm" className="h-9">
              <Save className="mr-2 h-4 w-4" /> Save
            </Button>
            <Button variant="outline" size="sm" className="h-9">
              <Share2 className="mr-2 h-4 w-4" /> Share
            </Button>
            <Button size="sm" className="h-9 bg-black hover:bg-gray-800">
              <Play className="mr-2 h-4 w-4" /> Run Pipeline
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Sidebar */}
        <div className="w-64 border-r border-gray-200 flex flex-col">
          {/* Sidebar header: search + tabs */}
          <div className="px-3 pt-4 pb-3 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 px-1">Add Steps</p>

            {/* Search */}
            <div className="relative mb-2">
              <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black bg-white"
              />
            </div>

            {/* Tabs */}
            <div className="flex bg-gray-100 rounded-md p-0.5">
              <button
                className={cn(
                  "flex-1 text-xs py-1.5 rounded font-medium transition-colors",
                  sidebarTab === "methods"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                )}
                onClick={() => { setSidebarTab("methods"); setSearchQuery("") }}
              >
                Methods
              </button>
              <button
                className={cn(
                  "flex-1 text-xs py-1.5 rounded font-medium transition-colors",
                  sidebarTab === "custom-modules"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                )}
                onClick={() => { setSidebarTab("custom-modules"); setSearchQuery("") }}
              >
                Custom
              </button>
            </div>
          </div>

          {/* Item list */}
          <div className="flex-1 overflow-y-auto py-2">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="group mx-2 mb-0.5 px-3 py-2.5 rounded-lg hover:bg-gray-50 cursor-grab flex items-start justify-between gap-2 transition-colors"
                  draggable
                  onDragStart={(e) => handleDragStart(e, { ...item, type: sidebarTab === "methods" ? "method" : "module" })}
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 leading-snug">{item.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5 leading-snug">{item.description}</p>
                  </div>
                  <button
                    className="opacity-0 group-hover:opacity-100 shrink-0 mt-0.5 w-5 h-5 rounded flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-all"
                    onClick={() => handleAddItem(item, sidebarTab === "methods" ? "method" : "module")}
                    title="Add to pipeline"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400 text-center py-10">No results</p>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex">
          {/* Canvas or List View */}
          <div className="flex-1">
            {viewMode === "visual" ? (
              <PipelineCanvas
                blocks={blocks}
                connections={connections}
                onAddBlock={handleAddBlock}
                onUpdateBlock={handleUpdateBlock}
                onRemoveBlock={handleRemoveBlock}
                onAddConnection={handleAddConnection}
                onRemoveConnection={handleRemoveConnection}
                onSelectBlock={handleSelectBlock}
                selectedBlockId={selectedBlockId}
              />
            ) : (
              <PipelineListView
                steps={transformedSteps}
                onRemoveBlock={handleRemoveBlock}
                onReorderBlocks={handleReorderBlocks}
                onSelectBlock={handleSelectBlock}
                selectedBlockId={selectedBlockId}
              />
            )}
          </div>

          {/* Properties Panel */}
          {showPropertiesPanel && selectedBlock && (
            <div className="w-80 border-l border-gray-200 bg-white p-4 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Properties</h3>
                <button
                  onClick={() => {
                    setShowPropertiesPanel(false)
                    setSelectedBlockId(null)
                  }}
                  className="p-1 rounded-sm hover:bg-gray-100 text-gray-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4 flex-1 overflow-auto">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <Input
                    value={selectedBlock.name}
                    onChange={(e) => handleUpdateBlock(selectedBlock.id, { name: e.target.value })}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={selectedBlock.description}
                    onChange={(e) => handleUpdateBlock(selectedBlock.id, { description: e.target.value })}
                    className="w-full min-h-[100px] rounded-md border border-gray-200 p-2"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <input
                    type="checkbox"
                    id="ready-status"
                    checked={selectedBlock.ready || false}
                    onChange={(e) => handleUpdateBlock(selectedBlock.id, { ready: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                  />
                  <label htmlFor="ready-status" className="font-medium">
                    Mark as Ready
                  </label>
                </div>

                <div className="pt-2">
                  <p className="text-xs text-gray-500 mb-1">Block Type</p>
                  <p className="text-sm font-medium">{selectedBlock.type === "method" ? "Method" : "Module"}</p>
                </div>

                {selectedBlock.stepNumber && (
                  <div className="pt-2">
                    <p className="text-xs text-gray-500 mb-1">Step Number</p>
                    <p className="text-sm font-medium">{selectedBlock.stepNumber}</p>
                  </div>
                )}

                <div className="pt-2">
                  <p className="text-xs text-gray-500 mb-1">ID</p>
                  <p className="text-sm">{selectedBlock.id.split("-")[1]?.substring(0, 3) || "0"}</p>
                </div>

                <div className="pt-2">
                  <p className="text-xs text-gray-500 mb-1">Position</p>
                  <div className="flex space-x-2">
                    <div>
                      <p className="text-xs text-gray-500">X</p>
                      <p className="text-sm">{Math.round(selectedBlock.position.x)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Y</p>
                      <p className="text-sm">{Math.round(selectedBlock.position.y)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
