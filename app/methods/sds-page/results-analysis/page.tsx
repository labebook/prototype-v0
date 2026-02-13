export default function SdsPageResultsAnalysisPage() {
  return (
    <>
      <h2 className="text-xl font-semibold mb-6">Results & Analysis</h2>

      <div className="space-y-8">
        <div>
          <h3 className="text-base font-bold mb-3">Visual Evaluation of Bands</h3>
          <p className="text-sm mb-2">
            Quick qualitative check with Coomassie/silver stain. After staining, bands can be visually inspected to
            assess protein presence, purity, and approximate molecular weight. This provides immediate feedback on
            sample quality and separation efficiency without specialized equipment.
          </p>
          <div className="flex space-x-4 mt-2">
            <div className="flex items-center">
              <span className="text-green-500 text-lg mr-1">✓</span>
              <span className="text-sm">Good for presence/purity</span>
            </div>
            <div className="flex items-center">
              <span className="text-red-500 text-lg mr-1">✗</span>
              <span className="text-sm">Limited quantitative accuracy</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-base font-bold mb-3">Manual Rf Measurement</h3>
          <p className="text-sm mb-2">
            Measure band & dye-front distances to calculate Rf for MW estimation. The relative mobility (Rf) is
            calculated as the ratio of the distance migrated by the protein to the distance migrated by the tracking
            dye. When plotted against the logarithm of molecular weight for standard proteins, this creates a
            calibration curve for estimating unknown protein sizes.
          </p>
          <div className="flex space-x-4 mt-2">
            <div className="flex items-center">
              <span className="text-green-500 text-lg mr-1">✓</span>
              <span className="text-sm">More precise</span>
            </div>
            <div className="flex items-center">
              <span className="text-red-500 text-lg mr-1">✗</span>
              <span className="text-sm">Labor-intensive, can vary with gel conditions</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-base font-bold mb-3">Software-Based Analysis</h3>
          <p className="text-sm mb-2">
            Tools like ImageJ automate band detection, intensity, and MW estimation. Modern gel analysis software can
            digitize gel images, automatically detect bands, quantify band intensity, and calculate molecular weights
            based on standards. This approach enables more objective, reproducible, and comprehensive analysis of
            complex protein mixtures.
          </p>
          <div className="flex space-x-4 mt-2">
            <div className="flex items-center">
              <span className="text-green-500 text-lg mr-1">✓</span>
              <span className="text-sm">High accuracy & reproducibility</span>
            </div>
            <div className="flex items-center">
              <span className="text-red-500 text-lg mr-1">✗</span>
              <span className="text-sm">Requires quality image and consistent staining</span>
            </div>
          </div>
        </div>
      </div>

      {/* Diagram Section */}
      <div className="mt-8">
        <div className="bg-gray-200 h-[300px] w-full flex items-center justify-center">
          <span className="text-gray-500">Results Analysis Workflow</span>
        </div>
      </div>
    </>
  )
}
