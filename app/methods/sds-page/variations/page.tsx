export default function SdsPageVariationsPage() {
  return (
    <>
      <h2 className="text-xl font-semibold mb-6">Variations</h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-base font-bold mb-2">Laemmli SDS-PAGE</h3>
          <p className="text-sm">
            Classical Glycine/SDS system for broad MW range. This is the most common SDS-PAGE system, using a
            discontinuous buffer system with a stacking gel (pH 6.8) and resolving gel (pH 8.8). The glycine in the
            running buffer creates a moving boundary that concentrates proteins into sharp bands before they enter the
            resolving gel. This system provides good resolution for proteins between 10-200 kDa.
          </p>
        </div>

        <div>
          <h3 className="text-base font-bold mb-2">Tricine SDS-PAGE</h3>
          <p className="text-sm">
            Uses tricine buffer for high resolution of small peptides ({"<"} 30 kDa). Developed by Schägger and von
            Jagow, this system replaces glycine with tricine in the running buffer. The higher pKa of tricine allows for
            better resolution of small proteins and peptides, particularly in the 1-30 kDa range. It's especially useful
            for membrane proteins and peptide analysis where traditional Laemmli systems perform poorly.
          </p>
        </div>

        <div>
          <h3 className="text-base font-bold mb-2">Urea SDS-PAGE</h3>
          <p className="text-sm">
            Adds urea to disrupt strong non-covalent bonds—ideal for aggregation-prone proteins. The addition of 6-8M
            urea to SDS-PAGE gels provides additional denaturing power, helping to solubilize proteins that resist
            standard SDS denaturation. This modification is particularly useful for membrane proteins, prion proteins,
            and other proteins with strong hydrophobic interactions or tendency to aggregate.
          </p>
        </div>

        <div>
          <h3 className="text-base font-bold mb-2">Gradient SDS-PAGE</h3>
          <p className="text-sm">
            4–20% acrylamide gradient for resolving proteins across wide size range. These gels feature a continuous
            gradient of increasing acrylamide concentration from top to bottom. The varying pore sizes allow for
            separation of a wide range of molecular weights in a single gel. High molecular weight proteins are resolved
            in the upper, low-percentage region, while small proteins are resolved in the lower, high-percentage region.
          </p>
        </div>
      </div>

      {/* Diagram Section */}
      <div className="mt-8">
        <div className="bg-gray-200 h-[300px] w-full flex items-center justify-center">
          <span className="text-gray-500">SDS-PAGE Variations Comparison</span>
        </div>
      </div>
    </>
  )
}
