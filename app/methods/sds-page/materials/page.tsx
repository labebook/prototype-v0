export default function SdsPageMaterialsPage() {
  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-6">SDS-PAGE Materials</h2>
      <p className="mb-4">This page contains information about the materials needed for SDS-PAGE.</p>

      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-medium mb-3">Equipment</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Electrophoresis chamber and power supply</li>
            <li>Gel casting apparatus</li>
            <li>Micropipettes and tips</li>
            <li>Microcentrifuge tubes</li>
            <li>Heat block or water bath</li>
            <li>Gel imaging system</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-medium mb-3">Chemicals</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Acrylamide/Bis-acrylamide solution</li>
            <li>Tris base</li>
            <li>Sodium dodecyl sulfate (SDS)</li>
            <li>Ammonium persulfate (APS)</li>
            <li>TEMED (N,N,N',N'-tetramethylethylenediamine)</li>
            <li>Glycine</li>
            <li>β-mercaptoethanol or DTT</li>
            <li>Bromophenol blue</li>
            <li>Glycerol</li>
            <li>Coomassie Brilliant Blue R-250</li>
            <li>Methanol</li>
            <li>Acetic acid</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-medium mb-3">Consumables</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Protein molecular weight markers</li>
            <li>Protein samples</li>
            <li>Gloves</li>
            <li>Lab tissues</li>
            <li>Containers for staining and destaining</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
