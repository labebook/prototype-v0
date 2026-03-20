"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronRight, Folder, FolderPlus, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { PipelineListView } from "@/components/pipeline-list-view"

// ── Types ─────────────────────────────────────────────────────────────────────

type Module = {
  id: string
  step: number
  name: string
  category: string
  objective: string
  method: string
  ready: boolean
  protocolId?: string
  parametersState: "none" | "selected" | "configured"
  dateSelected?: string
  author?: string
  executionStatus: "idle" | "running" | "completed" | "failed"
}

type Folder = { id: string; name: string }

// ── Initial data ──────────────────────────────────────────────────────────────

const initialFolders: Folder[] = [
  { id: "protein-analysis",  name: "Protein Analysis" },
  { id: "cell-culture",      name: "Cell Culture" },
  { id: "sample-prep",       name: "Sample Preparation" },
  { id: "data-analysis",     name: "Data Analysis" },
]

const initialModulesByFolder: Record<string, Module[]> = {
  "protein-analysis": [
    {
      id: "CM-001", step: 1,
      name: "Whole-Cell Protein Lysate Preparation Using Detergent-Based Buffer",
      category: "module",
      objective: "Standardized module for lysate preparation from suspension cells prior to Western blot analysis.",
      method: "Preparation Module · Dr. Johnson",
      ready: true, protocolId: "CM-001", parametersState: "configured",
      dateSelected: "2025-03-25", author: "Dr. Johnson", executionStatus: "idle",
    },
    {
      id: "CM-002", step: 2,
      name: "BCA Protein Quantification",
      category: "module",
      objective: "Determine protein concentration in cell lysates using the BCA colorimetric assay.",
      method: "Quantification Module · Dr. Johnson",
      ready: true, protocolId: "CM-002", parametersState: "configured",
      dateSelected: "2025-03-20", author: "Dr. Johnson", executionStatus: "idle",
    },
  ],
  "cell-culture": [
    {
      id: "CM-003", step: 1,
      name: "Mammalian Cell Passage Protocol",
      category: "module",
      objective: "Standard passaging of adherent mammalian cell lines to maintain culture health.",
      method: "Cell Culture Module · Dr. Lee",
      ready: true, protocolId: "CM-003", parametersState: "selected",
      dateSelected: "2025-03-18", author: "Dr. Lee", executionStatus: "idle",
    },
  ],
  "sample-prep": [],
  "data-analysis": [],
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function CustomModulesPage() {
  const [folders, setFolders]               = useState<Folder[]>(initialFolders)
  const [modulesByFolder, setModulesByFolder] = useState(initialModulesByFolder)
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null)

  const [newFolderOpen, setNewFolderOpen]   = useState(false)
  const [newFolderName, setNewFolderName]   = useState("")

  const activeFolder  = folders.find(f => f.id === activeFolderId) ?? null
  const activeModules = activeFolderId ? (modulesByFolder[activeFolderId] ?? []) : []

  function handleCreateFolder() {
    const trimmed = newFolderName.trim()
    if (!trimmed) return
    const id = trimmed.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
    setFolders(prev => [...prev, { id, name: trimmed }])
    setModulesByFolder(prev => ({ ...prev, [id]: [] }))
    setNewFolderName("")
    setNewFolderOpen(false)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex min-h-0">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-white">
          <div className="mx-auto max-w-[1200px] px-6 py-8">

            {/* ── Page header ───────────────────────────────────────── */}
            <div className="flex items-end justify-between pb-6 border-b border-gray-200 mb-0">
              <div>
                <h1 className="text-[32px] font-semibold">Operational Procedures</h1>
                <p className="text-gray-500 mt-1">
                  Browse and manage your operational procedures
                </p>
              </div>
              <div className="flex items-center gap-2">
                {!activeFolder && (
                  <Button variant="outline" size="sm" onClick={() => setNewFolderOpen(true)}>
                    <FolderPlus className="mr-2 h-4 w-4" />
                    New folder
                  </Button>
                )}
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  New module
                </Button>
              </div>
            </div>

            {/* ── Breadcrumb ────────────────────────────────────────── */}
            {activeFolder && (
              <div className="flex items-center gap-1.5 py-3 text-sm border-b border-gray-100">
                <button
                  onClick={() => setActiveFolderId(null)}
                  className="text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Operational Procedures
                </button>
                <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
                <span className="text-gray-900 font-medium">{activeFolder.name}</span>
              </div>
            )}

            {/* ── Column headers (root only) ────────────────────────── */}
            {!activeFolder && (
              <div className="flex items-center gap-4 -mx-6 px-6 py-2 border-b border-gray-100">
                <div className="h-5 w-5 shrink-0" />
                <div className="flex-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Name</div>
                <div className="w-20 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Modules</div>
                <div className="w-5 shrink-0" />
              </div>
            )}

            {/* ── Folder list (root) ────────────────────────────────── */}
            {!activeFolder && (
              <>
                {folders.length === 0 ? (
                  <div className="py-24 text-center">
                    <Folder className="h-10 w-10 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No folders yet</p>
                    <Button variant="outline" onClick={() => setNewFolderOpen(true)}>
                      <FolderPlus className="mr-2 h-4 w-4" />
                      New folder
                    </Button>
                  </div>
                ) : (
                  folders.map(folder => (
                    <button
                      key={folder.id}
                      onClick={() => setActiveFolderId(folder.id)}
                      className="group flex items-center gap-4 w-full py-3 border-b border-gray-100 hover:bg-gray-50 -mx-6 px-6 transition-colors text-left"
                    >
                      <Folder className="h-5 w-5 text-amber-400 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium text-gray-900">{folder.name}</span>
                      </div>
                      <div className="w-20 text-right">
                        <span className="text-xs text-gray-400">
                          {modulesByFolder[folder.id]?.length ?? 0}
                        </span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-300 shrink-0" />
                    </button>
                  ))
                )}
              </>
            )}

            {/* ── Module list (inside folder) ───────────────────────── */}
            {activeFolder && (
              activeModules.length === 0 ? (
                <div className="py-24 text-center">
                  <Folder className="h-10 w-10 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No modules in this folder</p>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    New module
                  </Button>
                </div>
              ) : (
                <PipelineListView
                  steps={activeModules}
                  hideColumns={['status', 'action']}
                  showMethodIcon
                  onParametersClick={step => console.log("Parameters:", step)}
                  onProtocolClick={step => console.log("Protocol:", step)}
                  onBuffersClick={step => console.log("Buffers:", step)}
                  onCalculationsClick={step => console.log("Calculations:", step)}
                  onMaterialsClick={step => console.log("Materials:", step)}
                  onPlanClick={step => console.log("Plan:", step)}
                />
              )
            )}

          </div>
        </main>
      </div>
      <Footer />

      {/* ── New folder dialog ─────────────────────────────────────────── */}
      <Dialog open={newFolderOpen} onOpenChange={setNewFolderOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>New folder</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Folder name"
            value={newFolderName}
            onChange={e => setNewFolderName(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") handleCreateFolder() }}
            autoFocus
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewFolderOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateFolder} disabled={!newFolderName.trim()}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
