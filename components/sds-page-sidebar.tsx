"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function SdsPageSidebar() {
  const pathname = usePathname()

  // Determine which section is active based on the pathname
  const isTheoryActive =
    pathname === "/methods/sds-page/theory" ||
    pathname === "/methods/sds-page/main" ||
    pathname === "/methods/sds-page/basic-principle" ||
    pathname === "/methods/sds-page/variations" ||
    pathname === "/methods/sds-page/troubleshooting" ||
    pathname === "/methods/sds-page/results-analysis"

  // Update to check if pathname starts with protocol path
  const isProtocolActive = pathname.startsWith("/methods/sds-page/protocol")
  const isDataAnalysisActive = pathname === "/methods/sds-page/data-analysis"

  const sidebarItems = [
    {
      name: "Theory",
      href: "/methods/sds-page/theory",
      isActive: isTheoryActive,
    },
    {
      name: "Protocol",
      href: "/methods/sds-page/protocol",
      isActive: isProtocolActive,
    },
    {
      name: "Data Analysis",
      href: "/methods/sds-page/data-analysis",
      isActive: isDataAnalysisActive,
    },
  ]

  return (
    <div className="w-full">
      <div className="sticky top-4">
        <nav>
          <ul className="space-y-2">
            {sidebarItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center h-12 px-4 ${
                    item.isActive ? "rounded-2xl bg-black text-white font-medium" : "text-gray-600 hover:text-gray-900"
                  }`}
                  aria-current={item.isActive ? "page" : undefined}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  )
}
