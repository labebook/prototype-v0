"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { ChevronRight, FlaskConical, Folder, Plus } from "lucide-react"

// ── Types ─────────────────────────────────────────────────────────────────────

interface MethodStep {
  id: string
  step: number
  name: string
  description: string
  category: string
  objective: string
  method: string
  ready: boolean
}

interface MethodFolder {
  id: string
  name: string
  methods: MethodStep[]
}

// ── Data ──────────────────────────────────────────────────────────────────────

const methodFolders: MethodFolder[] = [
  {
    id: "sds-page",
    name: "SDS-PAGE",
    methods: [
      {
        id: "sds-1", step: 1,
        name: "Standard Reducing Conditions",
        description: "Denaturing gel electrophoresis under β-ME reduction to separate proteins by molecular weight in the 10–250 kDa range.",
        category: "Electrophoresis", objective: "Protein separation", method: "SDS-PAGE", ready: true,
      },
      {
        id: "sds-2", step: 2,
        name: "Gradient Gel (4–20%)",
        description: "Continuous gradient gel providing extended resolution across a broad molecular weight range from 10 to 500 kDa.",
        category: "Electrophoresis", objective: "Broad-range separation", method: "SDS-PAGE", ready: true,
      },
      {
        id: "sds-3", step: 3,
        name: "Non-Reducing (Native Conditions)",
        description: "Electrophoresis without reducing agent, preserving disulfide bonds to analyze antibody assembly and intact complexes.",
        category: "Electrophoresis", objective: "Complex integrity", method: "SDS-PAGE", ready: false,
      },
    ],
  },
  {
    id: "western-blot",
    name: "Western Blot",
    methods: [
      {
        id: "wb-1", step: 1,
        name: "Chemiluminescent Detection (HRP)",
        description: "HRP-conjugated secondary antibody with ECL substrate for high-sensitivity protein detection on PVDF or nitrocellulose membranes.",
        category: "Immunodetection", objective: "Protein detection", method: "Western Blot", ready: true,
      },
      {
        id: "wb-2", step: 2,
        name: "Fluorescent Multiplex Detection",
        description: "Near-infrared fluorophore-labeled secondary antibodies enabling simultaneous detection of two proteins on the same blot.",
        category: "Immunodetection", objective: "Multiplex detection", method: "Western Blot", ready: true,
      },
      {
        id: "wb-3", step: 3,
        name: "Dot Blot Variant",
        description: "Rapid sample spotting directly onto membrane, bypassing gel electrophoresis, for fast semi-quantitative antigen detection.",
        category: "Immunodetection", objective: "Rapid detection", method: "Western Blot", ready: false,
      },
    ],
  },
  {
    id: "pcr",
    name: "PCR",
    methods: [
      {
        id: "pcr-1", step: 1,
        name: "Standard End-Point Amplification",
        description: "Conventional thermocycling to amplify target DNA sequences using Taq polymerase, verified by agarose gel electrophoresis.",
        category: "Amplification", objective: "DNA amplification", method: "PCR", ready: true,
      },
      {
        id: "pcr-2", step: 2,
        name: "Quantitative Real-Time (qPCR)",
        description: "SYBR Green or TaqMan probe-based fluorescent detection enabling precise quantification of gene expression or copy number.",
        category: "Quantification", objective: "Gene expression quantification", method: "PCR", ready: true,
      },
      {
        id: "pcr-3", step: 3,
        name: "Reverse Transcription (RT-PCR)",
        description: "Two-step cDNA synthesis from RNA template followed by standard PCR to detect and quantify mRNA expression.",
        category: "Amplification", objective: "mRNA detection", method: "PCR", ready: true,
      },
      {
        id: "pcr-4", step: 4,
        name: "Colony Screening",
        description: "Direct lysis of bacterial colonies as template for rapid verification of correct insert in transformed clones.",
        category: "Screening", objective: "Clone verification", method: "PCR", ready: false,
      },
    ],
  },
  {
    id: "elisa",
    name: "ELISA",
    methods: [
      {
        id: "elisa-1", step: 1,
        name: "Sandwich (Capture) Format",
        description: "Dual-antibody sandwich assay for quantitative detection of soluble antigens such as cytokines in serum or cell supernatant.",
        category: "Immunoassay", objective: "Antigen quantification", method: "ELISA", ready: true,
      },
      {
        id: "elisa-2", step: 2,
        name: "Direct Antigen Coating",
        description: "Antigen directly adsorbed to plate, detected with a single labeled antibody; suitable for antibody titer measurement.",
        category: "Immunoassay", objective: "Antibody titer", method: "ELISA", ready: true,
      },
      {
        id: "elisa-3", step: 3,
        name: "Competitive Inhibition Assay",
        description: "Signal inversely proportional to analyte concentration; used for small molecules, haptens, and drugs in complex matrices.",
        category: "Immunoassay", objective: "Small molecule detection", method: "ELISA", ready: false,
      },
    ],
  },
  {
    id: "mass-spec",
    name: "Mass Spectrometry",
    methods: [
      {
        id: "ms-1", step: 1,
        name: "LC-MS/MS Proteomics",
        description: "Nano-flow liquid chromatography coupled to tandem mass spectrometry for bottom-up identification of complex protein mixtures.",
        category: "Proteomics", objective: "Protein identification", method: "Mass Spectrometry", ready: true,
      },
      {
        id: "ms-2", step: 2,
        name: "MALDI-TOF Intact Mass",
        description: "Matrix-assisted laser desorption ionization for rapid intact protein mass measurement and QC of biopharmaceuticals.",
        category: "Proteomics", objective: "Intact mass measurement", method: "Mass Spectrometry", ready: true,
      },
      {
        id: "ms-3", step: 3,
        name: "Targeted MRM / PRM",
        description: "Multiple reaction monitoring for absolute quantification of predefined peptides as biomarkers or in PK studies.",
        category: "Quantification", objective: "Targeted quantification", method: "Mass Spectrometry", ready: false,
      },
    ],
  },
]

// ── Page ──────────────────────────────────────────────────────────────────────

export default function MethodsPage() {
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null)

  const activeFolder = activeFolderId
    ? methodFolders.find(f => f.id === activeFolderId) ?? null
    : null

  const totalMethods = methodFolders.reduce((sum, f) => sum + f.methods.length, 0)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1200px] px-6 py-8">

            {/* ── Page header ──────────────────────────────────────────── */}
            <div className="flex items-end justify-between pb-6 border-b border-gray-200 mb-0">
              <div>
                <h1 className="text-[32px] font-semibold">Methods</h1>
                <p className="text-gray-500 mt-1">
                  {totalMethods} {totalMethods === 1 ? "method" : "methods"} across{" "}
                  {methodFolders.length} groups
                </p>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New method
              </Button>
            </div>

            {/* ── Breadcrumb ───────────────────────────────────────────── */}
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

            {/* ── Folder view ──────────────────────────────────────────── */}
            {!activeFolder && (
              <>
                {/* Column headers */}
                <div className="flex items-center gap-4 -mx-6 px-6 py-2 border-b border-gray-100">
                  <div className="h-5 w-5 shrink-0" />
                  <div className="flex-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Name
                  </div>
                  <div className="w-24 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Methods
                  </div>
                  <div className="w-5 shrink-0" />
                </div>

                {/* Folder rows */}
                {methodFolders.map(folder => (
                  <button
                    key={folder.id}
                    onClick={() => setActiveFolderId(folder.id)}
                    className="group flex items-center gap-4 w-full py-3 border-b border-gray-100 hover:bg-gray-50 -mx-6 px-6 transition-colors text-left"
                  >
                    <Folder className="h-5 w-5 text-gray-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-gray-900">{folder.name}</span>
                    </div>
                    <div className="w-24 text-right">
                      <span className="text-xs text-gray-400">
                        {folder.methods.length} methods
                      </span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-300 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </>
            )}

            {/* ── Folder contents — method list ────────────────────────── */}
            {activeFolder && (
              <MethodListView methods={activeFolder.methods} />
            )}

          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}

// ── MethodListView ────────────────────────────────────────────────────────────

function MethodListView({ methods }: { methods: MethodStep[] }) {
  return (
    <div className="w-full overflow-auto">
      <table className="w-full border-collapse" role="table">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="w-[320px] py-3 px-4 text-left text-sm font-medium text-gray-500">
              Method Name
            </th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
              Description
            </th>
            <th className="w-[120px] py-3 px-4 text-left text-sm font-medium text-gray-500">
              Category
            </th>
          </tr>
        </thead>
        <tbody>
          {methods.map(method => (
            <tr
              key={method.id}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <td className="py-4 px-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-md bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                    <FlaskConical className="h-4 w-4 text-gray-500" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{method.name}</span>
                </div>
              </td>
              <td className="py-4 px-4">
                <p className="text-sm text-gray-500 leading-relaxed">{method.description}</p>
              </td>
              <td className="py-4 px-4">
                <span className="text-sm text-gray-500">{method.category}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
