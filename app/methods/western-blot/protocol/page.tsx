"use client"
import { useState } from "react"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function WesternBlotProtocolPage() {
  const router = useRouter()
  const [selectedPills, setSelectedPills] = useState<Record<string, boolean>>({
    pvdf: false,
    nitrocellulose: false,
    "sponges-required": false,
    "sponges-not-required": false,
    wet: false,
    "semi-dry": false,
    "milk-5": false,
    bsa: false,
    "blocking-other": false,
    "light-on": false,
    "light-off": false,
    ecl: false,
    ir: false,
    "detection-other": false,
    housekeeping: false,
    "total-protein": false,
  })

  const navigateToExampleProtocol = () => {
    router.push("/methods/western-blot/protocol/example")
  }

  const togglePill = (pillId: string) => {
    setSelectedPills((prev) => ({
      ...prev,
      [pillId]: !prev[pillId],
    }))
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
              <div className="ml-1.5">{/* Info icon removed */}</div>
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
  }: {
    number: number
    title: string
    id: string
    options?: Array<{ id: string; label: string; tooltip: string }>
    tooltip: string
  }) => {
    return (
      <div className="flex items-center flex-nowrap overflow-x-auto py-3 border-b border-gray-100 last:border-b-0">
        <div className="font-medium text-base whitespace-nowrap mr-2 flex items-center gap-2">
          <span>{number}.</span>
          <span>{title}</span>
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

  const SectionHeader = ({ title }: { title: string }) => {
    return <h3 className="text-lg font-semibold mt-6 mb-3 text-gray-900">{title}</h3>
  }

  return (
    <>
      <h2 className="text-2xl font-semibold mb-6">Protocol Plan</h2>

      <div className="mb-8 bg-white border border-[#E5E7EB] rounded-lg">
        <div className="px-6 pt-8 pb-24 relative">
          <div className="flex justify-between items-start mb-2">
            <div className="max-w-2xl">
              <p className="text-base text-gray-700">
                Select options for each step to customize the protocol plan for your experiment. Your choices will be
                used to generate the final protocol.
              </p>
            </div>
            <Button
              className="h-12 px-4 bg-black hover:bg-gray-800 text-white text-base font-normal"
              onClick={navigateToExampleProtocol}
            >
              View Common Protocol
            </Button>
          </div>

          {/* First Block: Preparatory Work */}
          <SectionHeader title="Preparatory Work" />
          <div className="space-y-0">
            <ProtocolStep
              number={1}
              title="Preparation of the Stack Components"
              id="prep-stack"
              options={[]}
              tooltip="Gather all materials needed for the transfer stack assembly including membrane, filter papers, and sponges."
            />

            <ProtocolStep
              number={2}
              title="Pre-wetting of Membrane"
              id="prewet-membrane"
              options={[
                {
                  id: "pvdf",
                  label: "PVDF",
                  tooltip: "PVDF membranes must be pre-wetted in methanol before transfer.",
                },
                {
                  id: "nitrocellulose",
                  label: "Nitrocellulose",
                  tooltip: "Nitrocellulose can be wetted directly in transfer buffer.",
                },
              ]}
              tooltip="PVDF membranes must be pre-wetted in methanol before transfer. Nitrocellulose can be wetted directly in transfer buffer."
            />

            <ProtocolStep
              number={3}
              title="Pre-wetting of the Filter Papers"
              id="prewet-papers"
              options={[]}
              tooltip="Soak filter papers in transfer buffer to ensure even conductivity and prevent air bubbles during transfer."
            />

            <ProtocolStep
              number={4}
              title="Pre-wetting of the Sponges"
              id="prewet-sponges"
              options={[
                {
                  id: "sponges-required",
                  label: "Sponges are required",
                  tooltip: "Wet transfer systems require sponges for even pressure.",
                },
                {
                  id: "sponges-not-required",
                  label: "Not required",
                  tooltip: "Semi-dry systems typically do not use sponges.",
                },
              ]}
              tooltip="Wet transfer systems require sponges for even pressure. Semi-dry systems typically do not use sponges."
            />

            <ProtocolStep
              number={5}
              title="Assembly of the Transfer Stack"
              id="assemble-stack"
              options={[]}
              tooltip="Ensure even contact between gel and membrane to avoid uneven transfer. Remove all air bubbles by rolling with a pipette or roller."
            />
          </div>

          {/* Second Block: Transfer Process */}
          <SectionHeader title="Transfer Process" />
          <div className="space-y-0">
            <ProtocolStep
              number={6}
              title="Setting up the Transfer Apparatus"
              id="setup-apparatus"
              options={[
                {
                  id: "wet",
                  label: "Wet",
                  tooltip: "Wet transfer uses a tank with buffer and cooling.",
                },
                {
                  id: "semi-dry",
                  label: "Semi-dry",
                  tooltip: "Semi-dry transfer is faster but may generate more heat.",
                },
              ]}
              tooltip="Wet transfer uses a tank with buffer and cooling. Semi-dry transfer is faster but may generate more heat."
            />

            <ProtocolStep
              number={7}
              title="Transfer Conditions"
              id="transfer-conditions"
              options={[]}
              tooltip="Typical conditions: 100V for 1-2 hours at 4°C (wet) or 25V for 30-45 min (semi-dry). Adjust based on protein size."
            />

            <ProtocolStep
              number={8}
              title="Removing and marking the membrane"
              id="mark-membrane"
              options={[]}
              tooltip="Handle membrane carefully with forceps. Mark protein ladder positions and orientation immediately after transfer."
            />
          </div>

          {/* Third Block: Blocking and Antibody Incubation */}
          <SectionHeader title="Blocking and Antibody Incubation" />
          <div className="space-y-0">
            <ProtocolStep
              number={9}
              title="Blocking"
              id="blocking"
              options={[
                {
                  id: "milk-5",
                  label: "5% milk",
                  tooltip: "Non-fat dry milk is economical and works for most antibodies.",
                },
                {
                  id: "bsa",
                  label: "BSA",
                  tooltip: "BSA is preferred for phospho-specific antibodies.",
                },
                {
                  id: "blocking-other",
                  label: "Other",
                  tooltip: "Commercial blocking buffers or alternative blocking agents.",
                },
              ]}
              tooltip="Block at room temperature for 1 hour or overnight at 4°C for better signal-to-noise. Choose blocking agent based on antibody compatibility."
            />

            <ProtocolStep
              number={10}
              title="Primary Antibody Incubation"
              id="primary-ab"
              options={[]}
              tooltip="Dilute primary antibody according to manufacturer's recommendations. Incubate 1-2 hours at room temperature or overnight at 4°C."
            />

            <ProtocolStep
              number={11}
              title="Washing"
              id="washing"
              options={[]}
              tooltip="Wash 3-5 times with TBST or PBST, 5-10 minutes each. Thorough washing reduces background signal."
            />

            <ProtocolStep
              number={12}
              title="Secondary Antibody Incubation"
              id="secondary-ab"
              options={[
                {
                  id: "light-on",
                  label: "Light protection on",
                  tooltip: "Protect from light when using fluorescent-conjugated secondary antibodies.",
                },
                {
                  id: "light-off",
                  label: "Light protection off",
                  tooltip: "Light protection not required for HRP-conjugated antibodies.",
                },
              ]}
              tooltip="Use HRP or fluorescent-conjugated secondary antibody. Protect from light if using fluorescent detection. Incubate 1 hour at room temperature."
            />
          </div>

          {/* Fourth Block: Detection and Analysis */}
          <SectionHeader title="Detection and Analysis" />
          <div className="space-y-0">
            <ProtocolStep
              number={13}
              title="Detection"
              id="detection"
              options={[
                {
                  id: "ecl",
                  label: "ECL",
                  tooltip: "Enhanced chemiluminescence for HRP-conjugated antibodies.",
                },
                {
                  id: "ir",
                  label: "IR",
                  tooltip: "Infrared detection for fluorescent secondary antibodies.",
                },
                {
                  id: "detection-other",
                  label: "Other",
                  tooltip: "Alternative detection methods like colorimetric substrates.",
                },
              ]}
              tooltip="Apply ECL substrate and expose to film or imager. Optimize exposure time to avoid saturation while capturing signal."
            />

            <ProtocolStep
              number={14}
              title="Quantification"
              id="quantification"
              options={[
                {
                  id: "housekeeping",
                  label: "Housekeeping protein",
                  tooltip: "Normalize to loading control like β-actin or GAPDH.",
                },
                {
                  id: "total-protein",
                  label: "Total protein",
                  tooltip: "Normalize to total protein stain for more accurate quantification.",
                },
              ]}
              tooltip="Normalize band intensity to loading control (housekeeping protein like β-actin) or total protein stain for accurate quantification."
            />

            <ProtocolStep
              number={15}
              title="Documentation and Data Storage"
              id="documentation"
              options={[]}
              tooltip="Save raw images and analysis files. Document all experimental conditions, antibody dilutions, and exposure times for reproducibility."
            />
          </div>

          <div className="absolute left-6 bottom-6">
            <Button
              className="h-12 px-4 bg-black hover:bg-gray-800 text-white text-base font-normal rounded-lg"
              onClick={navigateToExampleProtocol}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
