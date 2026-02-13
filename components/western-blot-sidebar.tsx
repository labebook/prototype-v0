"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function WesternBlotSidebar() {
  const pathname = usePathname()

  const isTheoryActive = pathname === "/methods/western-blot/theory"
  const isProtocolActive = pathname.startsWith("/methods/western-blot/protocol")
  const isPipelinesActive = pathname.startsWith("/methods/western-blot/pipelines")

  const sidebarItems = [
    {
      name: "Theory",
      href: "/methods/western-blot/theory",
      isActive: isTheoryActive,
    },
    {
      name: "Protocol",
      href: "/methods/western-blot/protocol",
      isActive: isProtocolActive,
    },
    {
      name: "Pipelines",
      href: "/methods/western-blot/pipelines",
      isActive: isPipelinesActive,
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
