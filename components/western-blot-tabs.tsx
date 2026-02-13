"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function WesternBlotTabs() {
  const pathname = usePathname()

  const tabs = [
    { name: "Overview", path: "/methods/western-blot/theory" },
    { name: "Method Principles", path: "/methods/western-blot/theory/principles" },
    { name: "Troubleshooting", path: "/methods/western-blot/theory/troubleshooting" },
    { name: "Data Analysis", path: "/methods/western-blot/theory/data-analysis" },
  ]

  return (
    <div className="border-b border-gray-200">
      <div className="flex gap-8">
        {tabs.map((tab) => (
          <Link
            key={tab.path}
            href={tab.path}
            className={`px-1 py-3 text-base transition-colors ${
              pathname === tab.path
                ? "border-b-2 border-black font-semibold text-gray-900"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab.name}
          </Link>
        ))}
      </div>
    </div>
  )
}
