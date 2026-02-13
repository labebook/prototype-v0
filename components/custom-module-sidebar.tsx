"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

interface CustomModuleSidebarProps {
  moduleSlug: string
}

export function CustomModuleSidebar({ moduleSlug }: CustomModuleSidebarProps) {
  const pathname = usePathname()

  const baseHref = `/custom-modules/${moduleSlug}`
  const theoryHref = `${baseHref}/theory`

  const isTheoryActive = pathname.startsWith(theoryHref)
  const isProtocolActive = pathname === baseHref

  const sidebarItems = [
    {
      name: "Theory",
      href: theoryHref,
      isActive: isTheoryActive,
    },
    {
      name: "Protocol",
      href: baseHref,
      isActive: isProtocolActive,
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
