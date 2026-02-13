import { Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function SdsPageBasicPrinciplePage() {
  return (
    <>
      <div className="flex items-center mb-6">
        <h2 className="text-xl font-semibold">Protein Separation Mechanism</h2>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="ml-2">
                <Info className="h-4 w-4 text-gray-500" />
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-md">
              <p>
                During sample preparation, proteins are denatured and given a uniform negative charge by SDS. In the
                electric field, migration speed depends only on molecular mass. Smaller proteins migrate faster,
                resulting in separation.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="font-medium mb-2">Denaturation & charge</h3>
          <p className="text-sm">
            SDS binds proteins, linearizes them, and confers uniform negative charge. The anionic detergent SDS binds to
            proteins at a ratio of approximately 1.4 g SDS per 1 g protein, giving them a uniform negative charge
            proportional to their mass. This binding also disrupts most non-covalent interactions, causing proteins to
            unfold into linear chains with similar charge-to-mass ratios.
          </p>
        </div>

        <div>
          <h3 className="font-medium mb-2">Electrophoresis</h3>
          <p className="text-sm">
            Under electric field, proteins migrate through gel pores by size. When voltage is applied, the negatively
            charged protein-SDS complexes migrate toward the positive electrode (anode). The polyacrylamide gel acts as
            a molecular sieve, allowing smaller proteins to move more quickly through the matrix while larger proteins
            are retarded. This creates separation based primarily on molecular weight.
          </p>
        </div>

        <div>
          <h3 className="font-medium mb-2">Gel matrix</h3>
          <p className="text-sm">
            Acrylamide concentration determines pore size—high % for small proteins, low % for large proteins. The
            percentage of acrylamide in the gel determines its pore size and thus its separation range. Typical
            concentrations range from 5% (for large proteins, 60-200 kDa) to 20% (for small proteins, 5-40 kDa). The
            crosslinking agent bisacrylamide creates the three-dimensional network that forms the sieving matrix.
          </p>
        </div>
      </div>

      {/* Diagram Section */}
      <div className="mt-8">
        <div className="bg-gray-200 h-[300px] w-full flex items-center justify-center">
          <span className="text-gray-500">Protein Separation Mechanism Diagram</span>
        </div>
      </div>
    </>
  )
}
