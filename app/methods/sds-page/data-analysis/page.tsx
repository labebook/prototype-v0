export default function SdsPageDataAnalysisPage() {
  return (
    <>
      <h2 className="text-2xl font-semibold mb-6">SDS-PAGE Data Analysis</h2>

      <div className="mb-8 bg-white border border-[#E5E7EB] rounded-lg">
        <div className="px-6 pt-8 pb-6 relative">
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-medium mb-4">Quantitative Analysis Methods</h3>
              <p className="mb-4">
                SDS-PAGE gels can be analyzed quantitatively to determine protein molecular weights, relative
                abundances, and purity. The following methods are commonly used for data analysis:
              </p>

              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium mb-2">Molecular Weight Determination</h4>
                  <p className="text-sm">
                    By comparing the migration distance of unknown proteins to a standard curve generated from molecular
                    weight markers, you can estimate the molecular weight of your proteins of interest. This is
                    typically done by calculating the relative mobility (Rf) value for each protein band.
                  </p>
                  <div className="mt-4 bg-gray-100 p-4 rounded-md">
                    <p className="text-sm font-medium">Rf Calculation:</p>
                    <p className="text-sm">Rf = (Distance migrated by protein) / (Distance migrated by tracking dye)</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium mb-2">Densitometry Analysis</h4>
                  <p className="text-sm">
                    Densitometry measures the optical density of protein bands to determine relative protein quantities.
                    This can be performed using gel documentation systems and analysis software that convert band
                    intensity into numerical values.
                  </p>
                  <div className="mt-4 bg-gray-100 p-4 rounded-md">
                    <p className="text-sm font-medium">Key Parameters:</p>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      <li>Band intensity (integrated optical density)</li>
                      <li>Background subtraction</li>
                      <li>Normalization to loading controls</li>
                      <li>Standard curve calibration</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium mb-2">Purity Assessment</h4>
                  <p className="text-sm">
                    The purity of a protein sample can be assessed by calculating the percentage of the target protein
                    relative to the total protein content. This is particularly important in protein purification
                    workflows.
                  </p>
                  <div className="mt-4 bg-gray-100 p-4 rounded-md">
                    <p className="text-sm font-medium">Purity Calculation:</p>
                    <p className="text-sm">
                      % Purity = (Intensity of target protein band / Total intensity of all bands) × 100
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-4">Software Tools</h3>
              <p className="mb-4">
                Several software tools are available for SDS-PAGE data analysis, ranging from free open-source options
                to commercial packages:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium mb-2">ImageJ / Fiji</h4>
                  <p className="text-sm">
                    Free, open-source software with gel analysis plugins. Offers lane profile analysis, band detection,
                    and molecular weight calculation.
                  </p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium mb-2">GelAnalyzer</h4>
                  <p className="text-sm">
                    Dedicated freeware for electrophoresis gel analysis. Features automatic lane and band detection, MW
                    calculation, and quantification.
                  </p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Bio-Rad Image Lab</h4>
                  <p className="text-sm">
                    Commercial software for Bio-Rad imaging systems. Provides comprehensive analysis tools including
                    automated MW analysis and report generation.
                  </p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium mb-2">GE ImageQuant</h4>
                  <p className="text-sm">
                    Commercial package for Amersham/GE imaging systems. Offers advanced quantification, background
                    subtraction methods, and validation tools.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-4">Data Visualization</h3>
              <div className="bg-gray-200 h-[300px] w-full flex items-center justify-center mb-4">
                <span className="text-gray-500">Data Analysis Visualization</span>
              </div>
              <p className="text-sm">
                Effective data visualization is crucial for interpreting SDS-PAGE results. Common visualization methods
                include lane profile plots, molecular weight calibration curves, and relative quantity bar charts. These
                visualizations help identify patterns, compare samples, and communicate results effectively.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
