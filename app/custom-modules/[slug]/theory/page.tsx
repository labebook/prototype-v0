export default function CustomModuleTheoryOverviewPage() {
  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Whole-Cell Protein Lysate Preparation (Detergent-Based)</h2>
      </div>

      <div className="space-y-4 text-base">
        <p>
          Whole-cell lysis is a fundamental technique used to extract total proteins from cells for biochemical
          analysis. In detergent-based methods, non-ionic or ionic detergents disrupt cellular membranes, releasing
          soluble proteins while maintaining their native or partially denatured state.
        </p>

        <p>
          The resulting lysate can be directly used for electrophoresis, enzyme assays, or immunoblotting. This approach
          is widely employed in proteomics, cell signaling studies, and protein characterization workflows.
        </p>

        <p>
          Proper selection of lysis buffer composition, including detergent type, salt concentration, and protease
          inhibitors, is critical for preserving protein integrity and obtaining reproducible results across different
          experimental conditions.
        </p>
      </div>

      {/* Optional: Add diagram or image placeholder */}
      <div className="mt-8 bg-gray-100 rounded-lg p-8 flex items-center justify-center min-h-[200px]">
        <span className="text-gray-500">Diagram: Cell lysis process overview</span>
      </div>
    </>
  )
}
