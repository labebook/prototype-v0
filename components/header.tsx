"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { EnhancedTeamSwitcher } from "@/components/enhanced-team-switcher"
import { CreateTeamDialog } from "@/components/create-team-dialog"
import { UserDropdown } from "@/components/user-dropdown"

const navItems = [
  { label: "Browse Methods", href: "/methods" },
  { label: "Team Workspace", href: "/projects" },
  { label: "Discussions", href: "/discussions" },
]

export function Header() {
  const [createTeamOpen, setCreateTeamOpen] = useState(false)
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
              pathname === item.href || pathname.startsWith(item.href + "/")
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
        </nav>

        {/* Right: Actions */}
        <div className="flex-shrink-0 flex items-center space-x-3">
          {/* Team Switcher */}
          <EnhancedTeamSwitcher
            onCreateTeam={() => setCreateTeamOpen(true)}
          />

          {/* User Dropdown */}
          <UserDropdown />
        </div>
      </div>

      <CreateTeamDialog
        open={createTeamOpen}
        onOpenChange={setCreateTeamOpen}
      />
    </header>
  )
}
