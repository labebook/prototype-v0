"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

interface CustomModuleTheoryTabsProps {
  moduleSlug: string
}

export function CustomModuleTheoryTabs({ moduleSlug }: CustomModuleTheoryTabsProps) {
  const pathname = usePathname()

  const tabs = [
    { name: "Overview", path: `/custom-modules/${moduleSlug}/theory` },
    { name: "Principles", path: `/custom-modules/${moduleSlug}/theory/principles` },
  ]

  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="flex space-x-8" aria-label="Theory tabs">
        {tabs.map((tab) => {
          const isActive = pathname === tab.path
          return (
            <Link
              key={tab.name}
              href={tab.path}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                isActive
                  ? "border-black text-black"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              {tab.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
