"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutGrid, Flag as Flask, FileText, Layers, FolderKanban } from "lucide-react"

const navItems = [
  {
    name: "Pipelines",
    href: "/pipelines",
    icon: LayoutGrid,
  },
  {
    name: "Projects",
    href: "/projects",
    icon: FolderKanban,
  },
  {
    name: "Methods",
    href: "/methods",
    icon: Flask,
  },
  {
    name: "Protocols",
    href: "/protocols",
    icon: FileText,
  },
  {
    name: "Custom Modules",
    href: "/custom-modules",
    icon: Layers,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r border-gray-200 h-full">
      <nav className="py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-base ${
                    isActive
                      ? "bg-gray-100 text-gray-900 font-medium"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
