"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, User, Settings, HelpCircle, LogOut } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTeam } from "@/hooks/useTeam"

export function UserDropdown() {
  const { currentUser } = useTeam()

  const handleLogout = () => {
    // In real app, this would handle logout
    console.log('Logout clicked')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center space-x-2 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors focus:outline-none">
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
          {currentUser.name.charAt(0)}
        </div>
        <span className="text-sm font-medium">{currentUser.name}</span>
        <ChevronDown className="h-4 w-4 text-gray-500" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 bg-white border-gray-200">
        <div className="px-3 py-2">
          <p className="text-sm font-medium">{currentUser.name}</p>
          <p className="text-xs text-gray-500">{currentUser.email}</p>
        </div>

        <DropdownMenuSeparator className="bg-gray-200" />

        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/profile" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            My Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/settings" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/help" className="flex items-center">
            <HelpCircle className="mr-2 h-4 w-4" />
            Help & Docs
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-gray-200" />

        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
