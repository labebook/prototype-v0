"use client"
import { useState } from "react"
import { Info, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function SdsPageProtocolPage() {
  const router = useRouter()
  const [variation, setVariation] = useState("")
  const [object, setObject] = useState("")
  const [application, setApplication] = useState("")
  const [activeModal, setActiveModal] = useState<string | null>(null)

  // State for toggle pills
  const [selectedPills, setSelectedPills] = useState<Record<string, boolean>>({
    "sds-treatment": false,
    "sds-with-mercaptoethanol": false,
    "sds-with-dtt": false,
    required: false,
    "not-required": false,
    "precast-gel": false,
    "handcast-gel": false,
    coomassie: false,
    "silver-staining": false,
    "imaging-systems": false,
    scanning: false,
    "manual-rf": false,
    "marker-comparison": false,
    "software-analysis": false,
  })

  // Navigate to example protocol page
  const navigateToExampleProtocol = () => {
    router.push("/methods/sds-page/protocol/example")
  }

  // Toggle pill selection
  const togglePill = (pillId: string) => {
    setSelectedPills((prev) => ({
      ...prev,
      [pillId]: !prev[pillId],
    }))
  }

  // Open modal for adding implementation
  const openAddImplementationModal = (stepId: string) => {
    setActiveModal(stepId)
    // In a real implementation, this would open a modal
    console.log(`Opening add implementation modal for step: ${stepId}`)
  }

  // Pill component with toggle functionality
  const TogglePill = ({
    id,
    label,
    tooltip,
  }: {
    id: string
    label: string
    tooltip: string
  }) => {
    const isSelected = selectedPills[id]

    return (
      <button
        role="button"
        aria-pressed={isSelected}
        className={cn(
          "flex items-center rounded-full px-2.5 py-0.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-black whitespace-nowrap",
          isSelected ? "bg-black text-white" : "bg-[#F3F4F6] text-[#374151] hover:bg-[#E5E7EB] border border-[#D1D5DB]",
        )}
        onClick={() => togglePill(id)}
      >
        <span className="truncate max-w-[150px]">{label}</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="ml-1.5">
                <Info className={cn("h-3.5 w-3.5", isSelected ? "text-white" : "text-gray-500")} />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </button>
    )
  }

  // Add Implementation Pill component
  const AddImplementationPill = ({ stepId }: { stepId: string }) => {
    return (
      <button
        role="button"
        aria-label={`Add implementation for ${stepId}`}
        className="flex items-center justify-center rounded-full px-2.5 py-0.5 h-7 bg-[#F3F4F6] border border-[#D1D5DB] hover:bg-[#E5E7EB] transition-colors focus:outline-none focus:ring-2 focus:ring-black"
        onClick={() => openAddImplementationModal(stepId)}
      >
        <Plus className="h-3.5 w-3.5 text-[#6B7280]" />
      </button>
    )
  }

  // Protocol Step component with inline options
  const ProtocolStep = ({
    number,
    title,
    id,
    options = [],
  }: {
    number: number
    title: string
    id: string
    options?: Array<{ id: string; label: string; tooltip: string }>
  }) => {
    return (
      <div className="flex items-center flex-nowrap overflow-x-auto py-3 border-b border-gray-100 last:border-b-0">
        <div className="font-medium text-base whitespace-nowrap mr-4">
          <span className="mr-1">{number}.</span>
          {title}
        </div>

        <div className="flex flex-nowrap gap-2 items-center">
          {options.length === 0 ? (
            <span className="text-sm text-gray-500 italic">No customization options available</span>
          ) : (
            <>
              {options.map((option) => (
                <TogglePill key={option.id} id={option.id} label={option.label} tooltip={option.tooltip} />
              ))}
              <AddImplementationPill stepId={id} />
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <>
      <h2 className="text-2xl font-semibold mb-6">SDS-PAGE Protocol</h2>

      <div className="mb-8 bg-white border border-[#E5E7EB] rounded-lg">
        <div className="px-6 pt-8 pb-24 relative">
          {/* Header with title and CTA button */}
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-medium">Customization Filters by Protocol Steps</h3>
            <Button
              className="h-12 px-4 bg-black hover:bg-gray-800 text-white text-base font-normal"
              onClick={navigateToExampleProtocol}
            >
              View Example Protocol
            </Button>
          </div>

          <p className="text-sm text-gray-600 mb-6">Select options to customize your protocol</p>

          {/* Three Dropdown Selectors */}
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="w-full sm:w-auto flex-grow">
              <Select value={variation} onValueChange={setVariation}>
                <SelectTrigger className="h-12 px-4 text-base border-gray-300 rounded-lg">
                  <SelectValue placeholder="Select Variation..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="laemmli">Laemmli SDS-PAGE</SelectItem>
                  <SelectItem value="tricine">Tricine SDS-PAGE</SelectItem>
                  <SelectItem value="urea">Urea SDS-PAGE</SelectItem>
                  <SelectItem value="gradient">Gradient SDS-PAGE</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full sm:w-auto flex-grow">
              <Select value={object} onValueChange={setObject}>
                <SelectTrigger className="h-12 px-4 text-base border-gray-300 rounded-lg">
                  <SelectValue placeholder="Select Object..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="proteins-peptides">Proteins and Peptides</SelectItem>
                  <SelectItem value="small-proteins">Small Proteins</SelectItem>
                  <SelectItem value="protein-complexes">Protein Complexes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full sm:w-auto flex-grow">
              <Select value={application} onValueChange={setApplication}>
                <SelectTrigger className="h-12 px-4 text-base border-gray-300 rounded-lg">
                  <SelectValue placeholder="Select Application..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quantitative">Quantitative Analysis</SelectItem>
                  <SelectItem value="qualitative">Qualitative Analysis</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Protocol Steps with Inline Options */}
          <div className="space-y-4">
            {/* All steps without section headers */}
            <ProtocolStep
              number={1}
              title="Prepare the Gel."
              id="prepare-gel"
              options={[
                { id: "precast-gel", label: "Precast gel", tooltip: "Commercial ready-to-use gels" },
                {
                  id: "handcast-gel",
                  label: "Handcast gel (single concentration)",
                  tooltip: "Self-prepared gel with uniform acrylamide percentage",
                },
              ]}
            />

            <ProtocolStep number={2} title="Quantify the Samples." id="quantify-samples" options={[]} />

            <ProtocolStep
              number={3}
              title="Mix the samples with the Loading buffer."
              id="mix-samples-loading-buffer"
              options={[
                { id: "sds-treatment", label: "SDS treatment", tooltip: "Standard SDS loading buffer" },
                {
                  id: "sds-with-mercaptoethanol",
                  label: "SDS with β-mercaptoethanol",
                  tooltip: "Reduces disulfide bonds",
                },
                { id: "sds-with-dtt", label: "SDS with DTT", tooltip: "Alternative reducing agent" },
              ]}
            />

            <ProtocolStep
              number={4}
              title="Mix Standard with Loading Buffer."
              id="mix-standard-loading-buffer"
              options={[
                { id: "required", label: "Required", tooltip: "Standard must be mixed with loading buffer" },
                { id: "not-required", label: "Not required", tooltip: "Pre-mixed standard" },
              ]}
            />

            <ProtocolStep
              number={5}
              title="Heat the samples (and standards, if required)."
              id="heat-samples"
              options={[]}
            />

            <ProtocolStep number={6} title="Assemble the Electrophoresis Cell." id="assemble-cell" options={[]} />

            <ProtocolStep number={7} title="Load the Running Buffer." id="load-buffer" options={[]} />

            <ProtocolStep number={8} title="Load the Samples and Standards." id="load-samples" options={[]} />

            <ProtocolStep number={9} title="Run the gel." id="run-gel" options={[]} />

            <ProtocolStep
              number={10}
              title="Stain the Gel for Total Protein."
              id="stain-gel"
              options={[
                { id: "coomassie", label: "Coomassie Brilliant Blue R-250", tooltip: "Standard protein stain" },
                { id: "silver-staining", label: "Silver staining", tooltip: "More sensitive detection" },
              ]}
            />

            <ProtocolStep
              number={11}
              title="Document the Gel."
              id="document-gel"
              options={[
                { id: "imaging-systems", label: "Imaging Systems", tooltip: "Digital gel documentation" },
                { id: "scanning", label: "Scanning", tooltip: "Flatbed scanner documentation" },
              ]}
            />

            <ProtocolStep
              number={12}
              title="Evaluate the Results."
              id="evaluate-results"
              options={[
                { id: "manual-rf", label: "Manual Rf Calculation", tooltip: "Calculate relative mobility manually" },
                { id: "marker-comparison", label: "Marker Comparison", tooltip: "Visual comparison to standards" },
                {
                  id: "software-analysis",
                  label: "Software-Based Analysis",
                  tooltip: "Digital analysis with specialized software",
                },
              ]}
            />
          </div>

          {/* Protocol Preview Button - Bottom Left Positioned with increased vertical gap */}
          <div className="absolute left-6 bottom-6">
            <Button
              className="h-12 px-4 bg-black hover:bg-gray-800 text-white text-base font-normal rounded-lg"
              onClick={navigateToExampleProtocol}
            >
              Protocol Preview
            </Button>
          </div>
        </div>
      </div>

      {/* This would be a modal component in a real implementation */}
      {activeModal && (
        <div className="hidden">
          <div>Add Implementation Modal for {activeModal}</div>
        </div>
      )}
    </>
  )
}
