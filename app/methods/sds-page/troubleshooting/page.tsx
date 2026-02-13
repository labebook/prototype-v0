export default function SdsPageTroubleshootingPage() {
  return (
    <>
      <h2 className="text-xl font-semibold mb-6">Troubleshooting</h2>

      <div className="space-y-6">
        <div className="border border-gray-300 rounded-lg p-4">
          <h3 className="text-base font-bold mb-2">Poor Resolution of Bands</h3>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-medium">Cause:</span> wrong acrylamide %, buffer pH, polymerization issues.
            </p>
            <p className="text-sm">
              <span className="font-medium">Fix:</span> adjust %T/%C, verify buffers, ensure proper stacking gel.
              Optimize acrylamide percentage for your target protein size range. Check buffer pH and freshness. Ensure
              complete polymerization by using fresh APS and TEMED, and allowing sufficient polymerization time.
            </p>
          </div>
        </div>

        <div className="border border-gray-300 rounded-lg p-4">
          <h3 className="text-base font-bold mb-2">Uneven/Skewed Bands</h3>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-medium">Cause:</span> overheating, sample overload, uneven wells.
            </p>
            <p className="text-sm">
              <span className="font-medium">Fix:</span> run at stable voltage, load evenly, mix reagents thoroughly. Use
              lower voltage to prevent overheating. Ensure wells are formed evenly during gel casting. Avoid
              overloading—typically use 10-50 μg protein per lane. Mix gel components thoroughly before pouring to
              ensure uniform polymerization.
            </p>
          </div>
        </div>

        <div className="border border-gray-300 rounded-lg p-4">
          <h3 className="text-base font-bold mb-2">Weak/Faint Bands</h3>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-medium">Cause:</span> low protein load, poor staining.
            </p>
            <p className="text-sm">
              <span className="font-medium">Fix:</span> quantify protein, optimize dye & staining times. Perform protein
              quantification before loading to ensure adequate amounts. Use fresh staining solution and optimize
              staining time. For low-abundance proteins, consider silver staining instead of Coomassie. Ensure complete
              protein transfer if performing Western blot.
            </p>
          </div>
        </div>

        <div className="border border-gray-300 rounded-lg p-4">
          <h3 className="text-base font-bold mb-2">Smearing/Streaking</h3>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-medium">Cause:</span> high salt, proteases, aggregation.
            </p>
            <p className="text-sm">
              <span className="font-medium">Fix:</span> desalting, protease inhibitors, reduce sample load. Perform
              buffer exchange or dialysis to reduce salt concentration in samples. Add protease inhibitors during sample
              preparation. Heat samples thoroughly (95°C for 5 minutes) to ensure complete denaturation. Centrifuge
              samples before loading to remove insoluble aggregates.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
