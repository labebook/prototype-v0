import Link from "next/link"

export default function WesternBlotDataAnalysisPage() {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Western Blot — Data Analysis</h2>
        <Link
          href="/methods/western-blot/protocol"
          className="h-10 px-4 bg-black hover:bg-gray-800 text-white text-sm font-medium rounded-lg inline-flex items-center"
        >
          View Protocol
        </Link>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
        <p className="text-gray-600">Data analysis content coming soon.</p>
      </div>
    </>
  )
}
