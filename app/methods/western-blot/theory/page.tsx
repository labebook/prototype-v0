export default function WesternBlotTheoryPage() {
  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Western Blot (Immunoblotting)</h2>
      </div>

      <p className="mb-6 text-base">
        Western blot is a widely used analytical technique in biochemistry, molecular biology, and immunology for
        detecting specific proteins in a sample through gel electrophoresis and antibody-based detection.
      </p>

      {/* Diagram Section */}
      <div className="flex flex-wrap mb-8">
        <div className="w-2/3 pr-4">
          <div className="w-full h-[300px] overflow-hidden rounded-lg">
            <img
              src="/images/western-blot-transfer.png"
              alt="Western Blot transfer process showing protein bands and transfer sandwich assembly"
              className="w-full h-full object-contain bg-gray-50"
            />
          </div>
        </div>
        <div className="w-1/3">
          <div className="bg-gray-200 h-[140px] mb-4 flex items-center justify-center">
            <span className="text-gray-500">Panel 1</span>
          </div>
          <div className="bg-gray-200 h-[140px] flex items-center justify-center">
            <span className="text-gray-500">Panel 2</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="py-4">
        <p>
          Western blot, also known as immunoblotting, is a technique used to detect and analyze specific proteins in a
          complex mixture. The process begins with protein separation using SDS-PAGE (Sodium Dodecyl Sulfate
          Polyacrylamide Gel Electrophoresis), where proteins are separated based on their molecular weight.
        </p>
        <p className="mt-4">
          After electrophoresis, the separated proteins are transferred from the gel to a membrane (typically
          nitrocellulose or PVDF). The membrane is then blocked to prevent non-specific antibody binding, followed by
          incubation with a primary antibody specific to the target protein. A secondary antibody conjugated to a
          detection enzyme or fluorophore is then applied, allowing visualization of the target protein.
        </p>
        <p className="mt-4">
          Western blotting is essential for protein identification, quantification, and analysis of protein expression
          levels. It is widely used in research, diagnostics, and quality control to confirm the presence of specific
          proteins, assess protein modifications, and validate experimental results.
        </p>
      </div>
    </>
  )
}
