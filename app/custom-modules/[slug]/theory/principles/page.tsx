export default function CustomModuleTheoryPrinciplesPage() {
  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Principles of Detergent-Based Lysis</h2>
      </div>

      <div className="space-y-4 text-base">
        <p>
          Detergent-based lysis buffers (e.g., NP-40, Triton X-100, RIPA) solubilize lipid bilayers by breaking
          hydrophobic interactions. Non-ionic detergents like NP-40 and Triton X-100 are milder and preserve
          protein-protein interactions, making them suitable for co-immunoprecipitation and native protein studies.
        </p>

        <p>
          Ionic detergents such as SDS (found in RIPA buffer) are more stringent and denature proteins, disrupting most
          protein complexes. This makes them ideal for total protein extraction and Western blot applications where
          complete solubilization is required.
        </p>

        <p>
          Additives such as protease or phosphatase inhibitors prevent post-lysis degradation and maintain
          post-translational modifications. The balance between detergent strength and buffer composition determines the
          efficiency of extraction and the preservation of protein function or structure.
        </p>

        <p>
          Temperature control is critical during lysis. Working on ice and using pre-chilled buffers minimizes protease
          activity and prevents protein aggregation, ensuring high-quality lysates for downstream applications.
        </p>
      </div>

      {/* Optional: Add comparison table or diagram */}
      <div className="mt-8 bg-gray-100 rounded-lg p-8 flex items-center justify-center min-h-[200px]">
        <span className="text-gray-500">Table: Comparison of detergent types and applications</span>
      </div>
    </>
  )
}
