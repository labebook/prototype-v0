"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ChevronRight, Folder } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { PipelineListView } from "@/components/pipeline-list-view"
import {
  ParametersModal,
  BufferRecipesModal,
  MaterialsModal,
} from "@/components/pipeline-modals"
import { WesternBlotPlanOverlay } from "@/components/western-blot-plan-overlay"
import { CustomModulePlanOverlay } from "@/components/custom-module-plan-overlay"

// ── Types ────────────────────────────────────────────────────────────────────

type Method = {
  id: string
  step: number
  name: string
  description: string
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

// ── Initial data ─────────────────────────────────────────────────────────────

const initialFolders = [
  { id: "sds-page",          name: "SDS-PAGE" },
  { id: "western-blot",      name: "Western Blot" },
  { id: "pcr",               name: "PCR" },
  { id: "elisa",             name: "ELISA" },
  { id: "mass-spectrometry", name: "Mass Spectrometry" },
]

const initialMethodsByFolder: Record<string, Method[]> = {
  "sds-page": [
    {
      id: "sds-1", step: 1,
      name: "Standard SDS-PAGE",
      description: "Separates proteins by molecular weight under denaturing conditions using a polyacrylamide gel matrix.",
      category: "method", objective: "Resolve proteins by molecular weight", method: "SDS-PAGE",
      ready: true, protocolId: "#101", parametersState: "configured", dateSelected: "2025-03-22", author: "Dr. Smith", executionStatus: "idle",
    },
    {
      id: "sds-2", step: 2,
      name: "Gradient SDS-PAGE",
      description: "Uses a gel with a continuous acrylamide gradient to resolve proteins across a broad molecular weight range.",
      category: "method", objective: "Broad-range protein separation", method: "Gradient SDS-PAGE",
      ready: true, protocolId: "#102", parametersState: "selected", dateSelected: "2025-03-20", author: "Dr. Smith", executionStatus: "idle",
    },
    {
      id: "sds-3", step: 3,
      name: "Tricine SDS-PAGE",
      description: "Optimized for resolving small proteins and peptides below 10 kDa using a tricine buffer system.",
      category: "method", objective: "Resolve small peptides and low MW proteins", method: "Tricine SDS-PAGE",
      ready: false, parametersState: "none", executionStatus: "idle",
    },
  ],
  "western-blot": [
    {
      id: "wb-1", step: 1,
      name: "Standard Western Blot",
      description: "Detects specific proteins via antibody-based probing following gel electrophoresis and membrane transfer.",
      category: "method", objective: "Detect target proteins with antibodies", method: "Western Blot",
      ready: true, protocolId: "#201", parametersState: "configured", dateSelected: "2025-03-18", author: "Dr. Johnson", executionStatus: "idle",
    },
    {
      id: "wb-2", step: 2,
      name: "Chemiluminescent Western Blot",
      description: "Uses HRP-conjugated secondary antibodies and ECL substrate for high-sensitivity protein detection.",
      category: "method", objective: "High-sensitivity protein detection via ECL", method: "Chemiluminescent WB",
      ready: true, protocolId: "#202", parametersState: "selected", dateSelected: "2025-03-15", author: "Dr. Johnson", executionStatus: "idle",
    },
    {
      id: "wb-3", step: 3,
      name: "Fluorescent Western Blot",
      description: "Employs fluorescently labeled antibodies for multiplexed, quantitative protein detection on a single membrane.",
      category: "method", objective: "Multiplexed quantitative protein detection", method: "Fluorescent WB",
      ready: false, parametersState: "none", executionStatus: "idle",
    },
  ],
  "pcr": [
    {
      id: "pcr-1", step: 1,
      name: "Standard PCR",
      description: "Amplifies specific DNA sequences exponentially using thermocycling and thermostable polymerase enzymes.",
      category: "method", objective: "Amplify target DNA sequences", method: "PCR",
      ready: true, protocolId: "#301", parametersState: "configured", dateSelected: "2025-03-12", author: "Dr. Lee", executionStatus: "idle",
    },
    {
      id: "pcr-2", step: 2,
      name: "Quantitative PCR (qPCR)",
      description: "Measures DNA or RNA abundance in real time using fluorescent reporters during amplification.",
      category: "method", objective: "Quantify nucleic acid targets in real time", method: "qPCR",
      ready: true, protocolId: "#302", parametersState: "selected", dateSelected: "2025-03-10", author: "Dr. Lee", executionStatus: "idle",
    },
    {
      id: "pcr-3", step: 3,
      name: "RT-PCR",
      description: "Reverse transcribes RNA into cDNA prior to PCR amplification, enabling detection of mRNA targets.",
      category: "method", objective: "Detect and quantify mRNA expression", method: "RT-PCR",
      ready: false, parametersState: "none", executionStatus: "idle",
    },
  ],
  "elisa": [
    {
      id: "elisa-1", step: 1,
      name: "Direct ELISA",
      description: "Quantifies antigen directly bound to a plate using an enzyme-conjugated primary antibody.",
      category: "method", objective: "Direct antigen quantification", method: "Direct ELISA",
      ready: true, protocolId: "#401", parametersState: "configured", dateSelected: "2025-03-08", author: "Dr. Park", executionStatus: "idle",
    },
    {
      id: "elisa-2", step: 2,
      name: "Sandwich ELISA",
      description: "Captures antigen between two antibodies for highly specific and sensitive protein quantification.",
      category: "method", objective: "High-sensitivity protein quantification", method: "Sandwich ELISA",
      ready: true, protocolId: "#402", parametersState: "configured", dateSelected: "2025-03-05", author: "Dr. Park", executionStatus: "idle",
    },
    {
      id: "elisa-3", step: 3,
      name: "Competitive ELISA",
      description: "Measures analyte concentration by competition with labeled antigen for limited antibody binding sites.",
      category: "method", objective: "Detect small molecules and haptens", method: "Competitive ELISA",
      ready: false, parametersState: "none", executionStatus: "idle",
    },
  ],
  "mass-spectrometry": [
    {
      id: "ms-1", step: 1,
      name: "LC-MS/MS Proteomics",
      description: "Identifies and quantifies proteins in complex mixtures by liquid chromatography coupled tandem mass spectrometry.",
      category: "method", objective: "Global proteome identification and quantification", method: "LC-MS/MS",
      ready: true, protocolId: "#501", parametersState: "configured", dateSelected: "2025-03-01", author: "Dr. Chen", executionStatus: "idle",
    },
    {
      id: "ms-2", step: 2,
      name: "MALDI-TOF MS",
      description: "Uses matrix-assisted laser desorption to ionize samples, enabling rapid protein or peptide mass fingerprinting.",
      category: "method", objective: "Rapid mass fingerprinting of proteins", method: "MALDI-TOF",
      ready: false, parametersState: "none", executionStatus: "idle",
    },
    {
      id: "ms-3", step: 3,
      name: "Selected Reaction Monitoring (SRM)",
      description: "Targeted mass spectrometry approach for precise quantification of predefined protein analytes.",
      category: "method", objective: "Targeted quantification of specific proteins", method: "SRM/MRM",
      ready: false, parametersState: "none", executionStatus: "idle",
    },
  ],
}

// ── Component ────────────────────────────────────────────────────────────────

export default function MethodsPage() {
  const [methodsByFolder, setMethodsByFolder] = useState(initialMethodsByFolder)
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null)
  const [activeModal, setActiveModal] = useState<{
    type: "parameters" | "buffers" | "materials" | "plan-western-blot" | "plan-custom"
    stepName: string
  } | null>(null)

  const [editingMethod, setEditingMethod] = useState<{
    folderId: string
    id: string
    name: string
    description: string
  } | null>(null)

  const activeFolder = initialFolders.find(f => f.id === activeFolderId) ?? null
  const activeMethods = activeFolderId ? (methodsByFolder[activeFolderId] ?? []) : []

  const handleEditSave = () => {
    if (!editingMethod || !editingMethod.name.trim()) return
    setMethodsByFolder(prev => ({
      ...prev,
      [editingMethod.folderId]: prev[editingMethod.folderId].map(m =>
        m.id === editingMethod.id
          ? { ...m, name: editingMethod.name.trim(), description: editingMethod.description.trim() }
          : m
      ),
    }))
    setEditingMethod(null)
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
                <h1 className="text-[32px] font-semibold">Methods</h1>
                <p className="text-gray-500 mt-1">
                  Browse and manage your collection of scientific methods
                </p>
              </div>
            </div>

            {/* ── Breadcrumb ────────────────────────────────────────── */}
            {activeFolder && (
              <div className="flex items-center gap-1.5 py-3 text-sm border-b border-gray-100">
                <button
                  onClick={() => setActiveFolderId(null)}
                  className="text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Methods
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
                <div className="w-20 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Methods</div>
                <div className="w-5 shrink-0" />
              </div>
            )}

            {/* ── Folder view (root) ────────────────────────────────── */}
            {!activeFolder && (
              <>
                {initialFolders.map(folder => (
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
                        {methodsByFolder[folder.id]?.length ?? 0}
                      </span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-300 shrink-0 " />
                  </button>
                ))}
              </>
            )}

            {/* ── Method list view (inside folder) ─────────────────── */}
            {activeFolder && (
              <PipelineListView
                steps={activeMethods}
                hideColumns={['status', 'action', 'dateSelected', 'author']}
                showCreatedColumn
                showMethodIcon
                onParametersClick={step => setActiveModal({ type: "parameters", stepName: step.name })}
                onProtocolClick={step => console.log("Protocol:", step)}
                onBuffersClick={step => setActiveModal({ type: "buffers", stepName: step.name })}
                onCalculationsClick={step => console.log("Calculations:", step)}
                onMaterialsClick={step => setActiveModal({ type: "materials", stepName: step.name })}
                onPlanClick={step => setActiveModal({
                  type: activeFolderId === "western-blot" ? "plan-western-blot" : "plan-custom",
                  stepName: step.name,
                })}
                onEditMethod={step =>
                  setEditingMethod({
                    folderId: activeFolder.id,
                    id: step.id,
                    name: step.name,
                    description: step.description ?? "",
                  })
                }
              />
            )}

          </div>
        </main>
      </div>
      <Footer />

      {/* ── Parameters modal ─────────────────────────────────────────── */}
      <ParametersModal
        isOpen={activeModal?.type === "parameters"}
        onClose={() => setActiveModal(null)}
        stepName={activeModal?.stepName ?? ""}
        isEditable={true}
      />

      {/* ── Buffer Recipes modal ──────────────────────────────────────── */}
      <BufferRecipesModal
        isOpen={activeModal?.type === "buffers"}
        onClose={() => setActiveModal(null)}
        stepName={activeModal?.stepName ?? ""}
        buffers={[
          {
            name: "Running Buffer (1×)",
            components: [
              { component: "Tris base", concentration: "25 mM", volume: "3.03 g/L" },
              { component: "Glycine", concentration: "192 mM", volume: "14.4 g/L" },
              { component: "SDS", concentration: "0.1%", volume: "1 g/L" },
            ],
          },
          {
            name: "Sample Buffer (2×)",
            components: [
              { component: "Tris-HCl pH 6.8", concentration: "100 mM", volume: "1 mL" },
              { component: "SDS", concentration: "4%", volume: "0.4 g" },
              { component: "Glycerol", concentration: "20%", volume: "2 mL" },
              { component: "β-mercaptoethanol", concentration: "200 mM", volume: "140 μL" },
            ],
          },
        ]}
      />

      {/* ── Materials modal ───────────────────────────────────────────── */}
      <MaterialsModal
        isOpen={activeModal?.type === "materials"}
        onClose={() => setActiveModal(null)}
        stepName={activeModal?.stepName ?? ""}
        materials={{
          reagents: [
            "Acrylamide/Bis-acrylamide (30%)",
            "Tris-HCl buffer pH 8.8",
            "Tris-HCl buffer pH 6.8",
            "SDS (10%)",
            "Ammonium persulfate (APS, 10%)",
            "TEMED",
          ],
          consumables: [
            "Glass plates and spacers",
            "Gel casting system",
            "Microcentrifuge tubes",
            "Pipette tips",
            "Protein ladder",
          ],
          equipment: [
            "Electrophoresis power supply",
            "Gel electrophoresis tank",
            "Heat block or boiling water bath",
            "Microcentrifuge",
          ],
        }}
      />

      {/* ── Plan overlays ─────────────────────────────────────────────── */}
      <WesternBlotPlanOverlay
        isOpen={activeModal?.type === "plan-western-blot"}
        onClose={() => setActiveModal(null)}
        onApply={() => setActiveModal(null)}
      />
      <CustomModulePlanOverlay
        isOpen={activeModal?.type === "plan-custom"}
        onClose={() => setActiveModal(null)}
        onApply={() => setActiveModal(null)}
      />

      {/* ── Edit method dialog ────────────────────────────────────────── */}
      <Dialog open={!!editingMethod} onOpenChange={open => { if (!open) setEditingMethod(null) }}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>Edit method</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="edit-method-name">Method name</Label>
              <Input
                id="edit-method-name"
                value={editingMethod?.name ?? ""}
                onChange={e => setEditingMethod(m => m ? { ...m, name: e.target.value } : m)}
                onKeyDown={e => e.key === "Enter" && handleEditSave()}
                autoFocus
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-method-desc">
                Description <span className="text-gray-400 font-normal">(optional)</span>
              </Label>
              <Textarea
                id="edit-method-desc"
                value={editingMethod?.description ?? ""}
                onChange={e => setEditingMethod(m => m ? { ...m, description: e.target.value } : m)}
                className="min-h-[80px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingMethod(null)}>Cancel</Button>
            <Button onClick={handleEditSave} disabled={!editingMethod?.name.trim()}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
