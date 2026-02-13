"use client"
import { useState } from "react"
import { Info, Plus } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface CustomModulePlanOverlayProps {
  isOpen: boolean
  onClose: () => void
  onApply: (selections: Record<string, boolean>, variation: string) => void
  initialSelections?: Record<string, boolean>
  initialVariation?: string
}

export function CustomModulePlanOverlay({
  isOpen,
  onClose,
  onApply,
  initialSelections = {},
  initialVariation = "suspension",
}: CustomModulePlanOverlayProps) {
  const [selectedPills, setSelectedPills] = useState<Record<string, boolean>>(initialSelections)
  const [variation, setVariation] = useState(initialVariation)

  if (!isOpen) return null

  const togglePill = (pillId: string) => {
    setSelectedPills((prev) => ({
      ...prev,
      [pillId]: !prev[pillId],
    }))
  }

  const handleApply = () => {
    onApply(selectedPills, variation)
    onClose()
  }

  const TogglePill = ({ id, label, tooltip }: { id: string; label: string; tooltip: string }) => {
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

  const AddImplementationPill = ({ stepId }: { stepId: string }) => {
    return (
      <button
        role="button"
        aria-label={`Add implementation for ${stepId}`}
        className="flex items-center justify-center rounded-full px-2.5 py-0.5 h-7 bg-[#F3F4F6] border border-[#D1D5DB] hover:bg-[#E5E7EB] transition-colors focus:outline-none focus:ring-2 focus:ring-black"
        onClick={() => console.log(`Add implementation for ${stepId}`)}
      >
        <Plus className="h-3.5 w-3.5 text-[#6B7280]" />
      </button>
    )
  }

  const ProtocolStep = ({
    number,
    title,
    id,
    options = [],
    tooltip,
    isInformational = false,
  }: {
    number: number
    title: string
    id: string
    options?: Array<{ id: string; label: string; tooltip: string }>
    tooltip: string
    isInformational?: boolean
  }) => {
    return (
      <div className="flex items-center flex-nowrap overflow-x-auto py-3 border-b border-gray-100 last:border-b-0">
        <div className="font-medium text-base whitespace-nowrap mr-4 flex items-center gap-2">
          <span>{number}.</span>
          <span>{title}</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="cursor-help">
                  <Info className="h-4 w-4 text-gray-500" />
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex flex-nowrap gap-2 items-center">
          {isInformational ? (
            <span className="text-sm text-gray-600 italic">Informational step - no options</span>
          ) : options.length === 0 ? (
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

  const SectionHeader = ({ title }: { title: string }) => {
    return <h3 className="text-lg font-semibold mt-6 mb-3 text-gray-900">{title}</h3>
  }

  const renderStepsForVariation = () => {
    if (variation === "suspension") {
      return (
        <>
          {/* Sample Preparation Section */}
          <SectionHeader title="Sample Preparation" />
          <div className="space-y-0">
            <ProtocolStep
              number={1}
              title="Cell Harvesting"
              id="cell-harvesting"
              options={[
                {
                  id: "harvest-method-1",
                  label: "Centrifugation (300-500 ×g)",
                  tooltip: "Standard method for harvesting suspension cells by gentle centrifugation.",
                },
                {
                  id: "harvest-method-2",
                  label: "Direct processing",
                  tooltip: "Process cells directly from culture without centrifugation step.",
                },
              ]}
              tooltip="Collect suspension cells from culture medium by centrifugation or direct processing."
            />

            <ProtocolStep
              number={2}
              title="Wash Cells (Pre-lysis)"
              id="wash-cells"
              options={[
                {
                  id: "wash-pbs",
                  label: "PBS",
                  tooltip: "Phosphate-buffered saline - standard wash buffer for most cell types.",
                },
                {
                  id: "wash-tbs",
                  label: "TBS",
                  tooltip: "Tris-buffered saline - alternative wash buffer, preferred for some applications.",
                },
              ]}
              tooltip="Wash cells with cold PBS or TBS to remove serum proteins and culture medium contaminants."
            />

            <ProtocolStep
              number={3}
              title="Storage of Cell Pellet (Pre-lysis)"
              id="storage-pellet"
              options={[
                {
                  id: "storage-not-required",
                  label: "Not required",
                  tooltip: "Proceed immediately to lysis without storing cell pellet.",
                },
              ]}
              tooltip="Cell pellets can be stored frozen before lysis if immediate processing is not possible."
            />
          </div>

          {/* Lysis Buffer Preparation Section */}
          <SectionHeader title="Lysis Buffer Preparation" />
          <div className="space-y-0">
            <ProtocolStep
              number={4}
              title="Base Buffer Type"
              id="base-buffer"
              options={[
                {
                  id: "buffer-np40",
                  label: "Mild non-ionic (NP-40 / Triton)",
                  tooltip: "Gentle detergent that preserves protein-protein interactions and membrane integrity.",
                },
                {
                  id: "buffer-ripa",
                  label: "Ionic (RIPA)",
                  tooltip: "Strong buffer for total protein extraction, disrupts most protein complexes.",
                },
                {
                  id: "buffer-urea",
                  label: "Denaturing (Urea / GdnHCl)",
                  tooltip: "Chaotropic agents for complete protein denaturation and solubilization.",
                },
              ]}
              tooltip="Select the base lysis buffer type based on your downstream application and target proteins."
            />

            <ProtocolStep
              number={5}
              title="Protease Inhibitors"
              id="protease-inhibitors"
              options={[
                {
                  id: "protease-not-required",
                  label: "Not required",
                  tooltip: "Proceed without protease inhibitors (not recommended for most applications).",
                },
              ]}
              tooltip="Protease inhibitors prevent degradation of proteins by endogenous proteases released during lysis."
            />

            <ProtocolStep
              number={6}
              title="Phosphatase Inhibitors"
              id="phosphatase-inhibitors"
              options={[
                {
                  id: "phosphatase-not-required",
                  label: "Not required",
                  tooltip: "Proceed without phosphatase inhibitors if phosphorylation state is not critical.",
                },
              ]}
              tooltip="Phosphatase inhibitors are essential for studying protein phosphorylation and signaling pathways."
            />

            <ProtocolStep
              number={7}
              title="Nuclease Treatment (viscosity control)"
              id="nuclease-treatment"
              options={[
                {
                  id: "nuclease-none",
                  label: "None",
                  tooltip: "No nuclease treatment, lysate may be viscous due to DNA/RNA.",
                },
                {
                  id: "nuclease-dnase",
                  label: "DNase",
                  tooltip: "Add DNase to digest genomic DNA and reduce viscosity.",
                },
                {
                  id: "nuclease-rnase",
                  label: "RNase",
                  tooltip: "Add RNase to digest RNA if RNA contamination is a concern.",
                },
                {
                  id: "nuclease-both",
                  label: "DNase + RNase",
                  tooltip: "Add both DNase and RNase for complete nucleic acid digestion.",
                },
              ]}
              tooltip="Nuclease treatment reduces lysate viscosity by digesting nucleic acids released during cell lysis."
            />

            <ProtocolStep
              number={8}
              title="Chelator (EDTA)"
              id="chelator"
              options={[
                {
                  id: "chelator-not-required",
                  label: "Not required",
                  tooltip: "Proceed without EDTA if metal-dependent enzymes need to remain active.",
                },
              ]}
              tooltip="EDTA chelates metal ions and inhibits metalloproteases, but may interfere with metal-dependent proteins."
            />

            <ProtocolStep
              number={9}
              title="Work on Ice / Pre-chilled Buffers"
              id="work-on-ice"
              options={[]}
              tooltip="Always work on ice and use pre-chilled buffers to minimize protein degradation and maintain protein stability throughout the lysis procedure."
              isInformational={true}
            />
          </div>

          {/* Principal Work Section */}
          <SectionHeader title="Principal Work" />
          <div className="space-y-0">
            <ProtocolStep
              number={10}
              title="Lysis"
              id="lysis"
              options={[
                {
                  id: "lysis-chemical",
                  label: "Chemical only",
                  tooltip: "Lysis by detergent action alone, gentlest method.",
                },
                {
                  id: "lysis-homogenization",
                  label: "Chemical + homogenization",
                  tooltip: "Combine detergent with mechanical disruption using homogenizer.",
                },
                {
                  id: "lysis-sonication",
                  label: "Chemical + brief sonication",
                  tooltip: "Combine detergent with brief sonication pulses to enhance lysis and reduce viscosity.",
                },
              ]}
              tooltip="Add lysis buffer to cell pellet and disrupt cells using chemical and/or mechanical methods."
            />

            <ProtocolStep
              number={11}
              title="Clarification"
              id="clarification"
              options={[
                {
                  id: "clarify-crude",
                  label: "Crude (no clear)",
                  tooltip: "Use total lysate without clarification, includes all cellular components.",
                },
                {
                  id: "clarify-precleared",
                  label: "Pre-cleared (low-speed spin)",
                  tooltip: "Low-speed centrifugation (1,000-3,000 ×g) to remove large debris and nuclei.",
                },
                {
                  id: "clarify-filtered",
                  label: "High-clear / Filtered",
                  tooltip: "Filter lysate through 0.45 µm filter for maximum clarity.",
                },
                {
                  id: "clarify-highspeed",
                  label: "High-clear (high-speed spin)",
                  tooltip: "High-speed centrifugation (10,000-14,000 ×g) to remove all insoluble material.",
                },
              ]}
              tooltip="Clarify lysate to remove cellular debris, nuclei, and insoluble material by centrifugation or filtration."
            />
          </div>

          {/* Storage Section */}
          <SectionHeader title="Storage" />
          <div className="space-y-0">
            <ProtocolStep
              number={12}
              title="Aliquot"
              id="aliquot"
              options={[
                {
                  id: "aliquot-not-required",
                  label: "Not required",
                  tooltip: "Store lysate in bulk without aliquoting.",
                },
              ]}
              tooltip="Aliquot lysate into small volumes to avoid repeated freeze-thaw cycles that can degrade proteins."
            />

            <ProtocolStep
              number={13}
              title="Snap-freeze"
              id="snap-freeze"
              options={[
                {
                  id: "snapfreeze-not-required",
                  label: "Not required",
                  tooltip: "Use lysate immediately or store at 4 °C for short-term use (1-2 days).",
                },
              ]}
              tooltip="Snap-freezing in liquid nitrogen preserves protein integrity for long-term storage at –80 °C."
            />
          </div>
        </>
      )
    } else {
      // Adherent Cells variation
      return (
        <>
          {/* Sample Preparation Section */}
          <SectionHeader title="Sample Preparation" />
          <div className="space-y-0">
            <ProtocolStep
              number={1}
              title="Cell Detachment"
              id="cell-detachment"
              options={[
                {
                  id: "harvest-trypsin",
                  label: "Trypsin-EDTA",
                  tooltip: "Enzymatic detachment using trypsin, most common method for adherent cells.",
                },
                {
                  id: "harvest-scraping",
                  label: "Cell scraping",
                  tooltip: "Mechanical detachment by scraping, preserves surface proteins.",
                },
                {
                  id: "harvest-edta",
                  label: "EDTA only",
                  tooltip: "Gentle detachment using EDTA without proteases, preserves cell surface proteins.",
                },
              ]}
              tooltip="Detach adherent cells from culture surface using enzymatic or mechanical methods."
            />

            <ProtocolStep
              number={2}
              title="Wash Cells (Pre-lysis)"
              id="wash-cells-adhesive"
              options={[
                {
                  id: "wash-pbs",
                  label: "PBS",
                  tooltip: "Phosphate-buffered saline - standard wash buffer for most cell types.",
                },
                {
                  id: "wash-tbs",
                  label: "TBS",
                  tooltip: "Tris-buffered saline - alternative wash buffer, preferred for some applications.",
                },
              ]}
              tooltip="Wash detached cells with cold PBS or TBS to remove trypsin, serum proteins, and culture medium."
            />

            <ProtocolStep
              number={3}
              title="Storage of Cell Pellet (Pre-lysis)"
              id="storage-pellet-adhesive"
              options={[
                {
                  id: "storage-not-required",
                  label: "Not required",
                  tooltip: "Proceed immediately to lysis without storing cell pellet.",
                },
              ]}
              tooltip="Cell pellets can be stored frozen before lysis if immediate processing is not possible."
            />
          </div>

          {/* Lysis Buffer Preparation Section */}
          <SectionHeader title="Lysis Buffer Preparation" />
          <div className="space-y-0">
            <ProtocolStep
              number={4}
              title="Base Buffer Type"
              id="base-buffer-adhesive"
              options={[
                {
                  id: "buffer-np40",
                  label: "Mild non-ionic (NP-40 / Triton)",
                  tooltip: "Gentle detergent that preserves protein-protein interactions and membrane integrity.",
                },
                {
                  id: "buffer-ripa",
                  label: "Ionic (RIPA)",
                  tooltip: "Strong buffer for total protein extraction, disrupts most protein complexes.",
                },
                {
                  id: "buffer-urea",
                  label: "Denaturing (Urea / GdnHCl)",
                  tooltip: "Chaotropic agents for complete protein denaturation and solubilization.",
                },
              ]}
              tooltip="Select the base lysis buffer type based on your downstream application and target proteins."
            />

            <ProtocolStep
              number={5}
              title="Protease Inhibitors"
              id="protease-inhibitors-adhesive"
              options={[
                {
                  id: "protease-not-required",
                  label: "Not required",
                  tooltip: "Proceed without protease inhibitors (not recommended for most applications).",
                },
              ]}
              tooltip="Protease inhibitors prevent degradation of proteins by endogenous proteases released during lysis."
            />

            <ProtocolStep
              number={6}
              title="Phosphatase Inhibitors"
              id="phosphatase-inhibitors-adhesive"
              options={[
                {
                  id: "phosphatase-not-required",
                  label: "Not required",
                  tooltip: "Proceed without phosphatase inhibitors if phosphorylation state is not critical.",
                },
              ]}
              tooltip="Phosphatase inhibitors are essential for studying protein phosphorylation and signaling pathways."
            />

            <ProtocolStep
              number={7}
              title="Nuclease Treatment (viscosity control)"
              id="nuclease-treatment-adhesive"
              options={[
                {
                  id: "nuclease-none",
                  label: "None",
                  tooltip: "No nuclease treatment, lysate may be viscous due to DNA/RNA.",
                },
                {
                  id: "nuclease-dnase",
                  label: "DNase",
                  tooltip: "Add DNase to digest genomic DNA and reduce viscosity.",
                },
                {
                  id: "nuclease-rnase",
                  label: "RNase",
                  tooltip: "Add RNase to digest RNA if RNA contamination is a concern.",
                },
                {
                  id: "nuclease-both",
                  label: "DNase + RNase",
                  tooltip: "Add both DNase and RNase for complete nucleic acid digestion.",
                },
              ]}
              tooltip="Nuclease treatment reduces lysate viscosity by digesting nucleic acids released during cell lysis."
            />

            <ProtocolStep
              number={8}
              title="Chelator (EDTA)"
              id="chelator-adhesive"
              options={[
                {
                  id: "chelator-not-required",
                  label: "Not required",
                  tooltip: "Proceed without EDTA if metal-dependent enzymes need to remain active.",
                },
              ]}
              tooltip="EDTA chelates metal ions and inhibits metalloproteases, but may interfere with metal-dependent proteins."
            />

            <ProtocolStep
              number={9}
              title="Work on Ice / Pre-chilled Buffers"
              id="work-on-ice-adhesive"
              options={[]}
              tooltip="Always work on ice and use pre-chilled buffers to minimize protein degradation and maintain protein stability throughout the lysis procedure."
              isInformational={true}
            />
          </div>

          {/* Principal Work Section */}
          <SectionHeader title="Principal Work" />
          <div className="space-y-0">
            <ProtocolStep
              number={10}
              title="Lysis"
              id="lysis-adhesive"
              options={[
                {
                  id: "lysis-chemical",
                  label: "Chemical only",
                  tooltip: "Lysis by detergent action alone, gentlest method.",
                },
                {
                  id: "lysis-homogenization",
                  label: "Chemical + homogenization",
                  tooltip: "Combine detergent with mechanical disruption using homogenizer.",
                },
                {
                  id: "lysis-sonication",
                  label: "Chemical + brief sonication",
                  tooltip: "Combine detergent with brief sonication pulses to enhance lysis and reduce viscosity.",
                },
              ]}
              tooltip="Add lysis buffer to cell pellet and disrupt cells using chemical and/or mechanical methods."
            />

            <ProtocolStep
              number={11}
              title="Clarification"
              id="clarification-adhesive"
              options={[
                {
                  id: "clarify-crude",
                  label: "Crude (no clear)",
                  tooltip: "Use total lysate without clarification, includes all cellular components.",
                },
                {
                  id: "clarify-precleared",
                  label: "Pre-cleared (low-speed spin)",
                  tooltip: "Low-speed centrifugation (1,000-3,000 ×g) to remove large debris and nuclei.",
                },
                {
                  id: "clarify-filtered",
                  label: "High-clear / Filtered",
                  tooltip: "Filter lysate through 0.45 µm filter for maximum clarity.",
                },
                {
                  id: "clarify-highspeed",
                  label: "High-clear (high-speed spin)",
                  tooltip: "High-speed centrifugation (10,000-14,000 ×g) to remove all insoluble material.",
                },
              ]}
              tooltip="Clarify lysate to remove cellular debris, nuclei, and insoluble material by centrifugation or filtration."
            />
          </div>

          {/* Storage Section */}
          <SectionHeader title="Storage" />
          <div className="space-y-0">
            <ProtocolStep
              number={12}
              title="Aliquot"
              id="aliquot-adhesive"
              options={[
                {
                  id: "aliquot-not-required",
                  label: "Not required",
                  tooltip: "Store lysate in bulk without aliquoting.",
                },
              ]}
              tooltip="Aliquot lysate into small volumes to avoid repeated freeze-thaw cycles that can degrade proteins."
            />

            <ProtocolStep
              number={13}
              title="Snap-freeze"
              id="snap-freeze-adhesive"
              options={[
                {
                  id: "snapfreeze-not-required",
                  label: "Not required",
                  tooltip: "Use lysate immediately or store at 4 °C for short-term use (1-2 days).",
                },
              ]}
              tooltip="Snap-freezing in liquid nitrogen preserves protein integrity for long-term storage at –80 °C."
            />
          </div>
        </>
      )
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-2xl w-[1080px] h-[85vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Whole-Cell Protein Lysate — Plan & Options</h2>
            <p className="text-sm text-gray-600 mt-1">Customize module steps and options for your pipeline.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={onClose} className="h-10 px-6 bg-transparent">
              Cancel
            </Button>
            <Button onClick={handleApply} className="h-10 px-6 bg-black hover:bg-gray-800 text-white">
              Apply to Pipeline
            </Button>
          </div>
        </div>

        {/* Body - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Variation Selector */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Variation</label>
            <Select value={variation} onValueChange={setVariation}>
              <SelectTrigger className="h-12 px-4 text-base border-gray-300 rounded-lg w-full sm:w-auto sm:min-w-[300px]">
                <SelectValue placeholder="Select Variation..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="suspension">Suspension Cells</SelectItem>
                <SelectItem value="adhesive">Adherent Cells</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {renderStepsForVariation()}
        </div>
      </div>
    </div>
  )
}
