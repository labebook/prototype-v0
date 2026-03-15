"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Layers, Plus } from "lucide-react"
import { PipelineListView } from "@/components/pipeline-list-view"

const sampleModels = [
  {
    id: "EM-001",
    step: 1,
    name: "MCF-7 Breast Cancer Cell Line Model",
    category: "module",
    objective: "Estrogen receptor-positive breast cancer cell model for drug response studies.",
    method: "Experimental Model · Dr. Martinez",
    ready: true,
    protocolId: "EM-001",
    parametersState: "configured" as const,
    dateSelected: "2025-03-20",
    author: "Dr. Martinez",
    executionStatus: "idle" as const,
  },
  {
    id: "EM-002",
    step: 2,
    name: "HeLa Cell Transfection Model",
    category: "module",
    objective: "Standard model for transient gene expression and protein overexpression studies.",
    method: "Experimental Model · Dr. Chen",
    ready: true,
    protocolId: "EM-002",
    parametersState: "configured" as const,
    dateSelected: "2025-03-18",
    author: "Dr. Chen",
    executionStatus: "idle" as const,
  },
]

export default function ExperimentalModelsPage() {
  const [models] = useState(sampleModels)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex min-h-0">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-white">
          <div className="mx-auto max-w-[1200px] px-6 py-8">

            {/* ── Page header ───────────────────────────────────────── */}
            <div className="flex items-end justify-between pb-6 border-b border-gray-200 mb-8">
              <div>
                <h1 className="text-[32px] font-semibold">Experimental Models</h1>
                <p className="text-gray-500 mt-1">
                  Browse and manage experimental models and cell line configurations
                </p>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New model
              </Button>
            </div>

            {/* ── Models list ──────────────────────────────────────── */}
            {models.length === 0 ? (
              <div className="py-24 text-center">
                <Layers className="h-10 w-10 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No experimental models yet</p>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New model
                </Button>
              </div>
            ) : (
              <PipelineListView
                steps={models}
                hideColumns={['status', 'action']}
                onParametersClick={step => console.log("Parameters:", step)}
                onProtocolClick={step => console.log("Protocol:", step)}
                onBuffersClick={step => console.log("Buffers:", step)}
                onCalculationsClick={step => console.log("Calculations:", step)}
                onMaterialsClick={step => console.log("Materials:", step)}
                onPlanClick={step => console.log("Plan:", step)}
              />
            )}

          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}
