"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { PipelineListView } from "@/components/pipeline-list-view"

const sampleMethods = [
  {
    id: "M001",
    step: 1,
    name: "SDS-PAGE",
    category: "method",
    objective: "Separate proteins by molecular weight using polyacrylamide gel electrophoresis",
    method: "Sodium dodecyl sulfate–polyacrylamide gel electrophoresis",
    ready: true,
    protocolId: "#101",
    parametersState: "configured" as const,
    dateSelected: "2025-03-22",
    author: "Dr. Smith",
    executionStatus: "idle" as const,
  },
  {
    id: "M002",
    step: 2,
    name: "Western Blot",
    category: "method",
    objective: "Detect specific proteins in a sample using antibody-based detection",
    method: "Protein detection technique using antibodies",
    ready: true,
    protocolId: "#202",
    parametersState: "selected" as const,
    dateSelected: "2025-03-18",
    author: "Dr. Johnson",
    executionStatus: "idle" as const,
  },
  {
    id: "M003",
    step: 3,
    name: "PCR",
    category: "method",
    objective: "Amplify specific DNA sequences for analysis",
    method: "Polymerase chain reaction for DNA amplification",
    ready: true,
    protocolId: undefined,
    parametersState: "none" as const,
    dateSelected: undefined,
    author: undefined,
    executionStatus: "idle" as const,
  },
  {
    id: "M004",
    step: 4,
    name: "ELISA",
    category: "method",
    objective: "Quantify proteins or antibodies using enzyme-linked detection",
    method: "Enzyme-linked immunosorbent assay",
    ready: true,
    protocolId: "#404",
    parametersState: "configured" as const,
    dateSelected: "2025-03-10",
    author: "Dr. Lee",
    executionStatus: "idle" as const,
  },
  {
    id: "M005",
    step: 5,
    name: "Mass Spectrometry",
    category: "method",
    objective: "Identify and quantify molecules by mass-to-charge ratio",
    method: "Analytical technique to measure mass-to-charge ratio of ions",
    ready: false,
    protocolId: undefined,
    parametersState: "none" as const,
    dateSelected: undefined,
    author: undefined,
    executionStatus: "idle" as const,
  },
]

export default function MethodsPage() {
  const [methods] = useState(sampleMethods)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1200px] px-6 py-8">

            {/* ── Page header ───────────────────────────────────────── */}
            <div className="flex items-end justify-between mb-8 pb-6 border-b border-gray-200">
              <div>
                <h1 className="text-[32px] font-semibold">Methods</h1>
                <p className="text-gray-500 mt-1">
                  Browse and manage your collection of scientific methods
                </p>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New method
              </Button>
            </div>

            {/* ── Methods list ──────────────────────────────────────── */}
            {methods.length === 0 ? (
              <div className="py-24 text-center">
                <p className="text-lg font-medium text-gray-700 mb-1">No methods yet</p>
                <p className="text-gray-500 mb-6">Get started by creating your first method</p>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New method
                </Button>
              </div>
            ) : (
              <PipelineListView
                steps={methods}
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
