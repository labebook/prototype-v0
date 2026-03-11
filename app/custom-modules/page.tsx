"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Layers, Plus } from "lucide-react"
import { PipelineListView } from "@/components/pipeline-list-view"

const sampleModules = [
  {
    id: "CM-001",
    step: 1,
    name: "Whole-Cell Protein Lysate Preparation Using Detergent-Based Buffer",
    category: "module",
    objective: "Standardized module for lysate preparation from suspension cells prior to Western blot analysis.",
    method: "Preparation Module · Dr. Johnson",
    ready: true,
    protocolId: "CM-001",
    parametersState: "configured" as const,
    dateSelected: "2025-03-25",
    author: "Dr. Johnson",
    executionStatus: "idle" as const,
  },
]

export default function CustomModulesPage() {
  const [modules] = useState(sampleModules)

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
                <h1 className="text-[32px] font-semibold">Operational Procedures</h1>
                <p className="text-gray-500 mt-1">
                  Browse and manage your operational procedures
                </p>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New module
              </Button>
            </div>

            {/* ── Modules list ──────────────────────────────────────── */}
            {modules.length === 0 ? (
              <div className="py-24 text-center">
                <Layers className="h-10 w-10 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No custom modules yet</p>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New module
                </Button>
              </div>
            ) : (
              <PipelineListView
                steps={modules}
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
