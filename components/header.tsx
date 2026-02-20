"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search } from "lucide-react"
import { UserDropdown } from "@/components/user-dropdown"

const navItems = [
  { label: "Browse Methods", href: "/" },
  { label: "Team Workspace", href: "/projects" },
  { label: "Discussions", href: "/discussions" },
]

export function Header() {
  const pathname = usePathname()

  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="w-full flex justify-between items-center px-6 h-16">
        {/* Left: Logo */}
        <div className="flex-shrink-0">
          <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors">
            PLYOW
          </Link>
        </div>

        {/* Center: Navigation Menu */}
        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {item.label}
              </Link>
            )
          })}
          <div className="relative ml-2">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="h-9 w-48 rounded-md border border-gray-300 bg-gray-50 pl-8 pr-3 text-sm text-gray-900 placeholder:text-gray-400 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </nav>

        {/* Right: User Avatar */}
        <div className="flex-shrink-0">
          <UserDropdown />
        </div>
      </div>
    </header>
  )
}
