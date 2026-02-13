export default function SdsPageMainPage() {
  return (
    <>
      <h2 className="text-2xl font-semibold mb-6">Sodium Dodecyl Sulfate Polyacrylamide Gel Electrophoresis</h2>

      <p className="text-base mb-8">
        SDS-PAGE is a widely used analytical technique in biochemistry, molecular biology, and proteomics for separating
        proteins according to their molecular weight.
      </p>

      {/* Diagram Section */}
      <div className="flex flex-wrap mb-8">
        <div className="w-2/3 pr-4">
          <div className="bg-gray-200 h-[300px] w-full flex items-center justify-center">
            <span className="text-gray-500">Gel Electrophoresis Diagram</span>
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

      <div className="mt-8">
        <p className="text-base">
          SDS-PAGE (Sodium Dodecyl Sulfate Polyacrylamide Gel Electrophoresis) is a technique used to separate proteins
          based on their molecular weight. The technique involves the use of sodium dodecyl sulfate (SDS), an anionic
          detergent that denatures proteins and gives them a uniform negative charge, and polyacrylamide gel, which acts
          as a molecular sieve.
        </p>
        <p className="text-base mt-4">
          When an electric field is applied, the negatively charged proteins migrate towards the positive electrode
          (anode) at different rates depending on their size. Smaller proteins move faster through the gel matrix, while
          larger proteins move more slowly, resulting in separation based on molecular weight.
        </p>
        <p className="text-base mt-4">
          SDS-PAGE is widely used in protein analysis, including protein identification, purity assessment, and
          molecular weight determination. It is also a crucial step in many other techniques, such as Western blotting
          and mass spectrometry.
        </p>
      </div>
    </>
  )
}
