"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Bell, ChevronDown } from "lucide-react"
import ConnectWallet from "@/components/ConnectWallet" // Đường dẫn đến component ConnectWallet của bạn

export default function Navbar() {
  return (
    <header className="bg-indigo-950/80 border-b border-indigo-800/50">
      <div className="container mx-auto px-12">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="mr-8">
              <div className="bg-indigo-800/80 text-white font-bold p-4 h-16 w-24 flex items-center justify-center">
                Logo
              </div>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/create" className="text-gray-300 hover:text-white transition-colors">
                Create
              </Link>
              <Link href="/search" className="text-gray-300 hover:text-white transition-colors">
                Search
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="link" className="text-gray-300 hover:text-white">
                    More <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-indigo-900 border-indigo-700">
                  <DropdownMenuItem className="text-gray-300 hover:bg-indigo-800 focus:bg-indigo-800">
                    <Link href="/about" className="w-full">
                      About
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-gray-300 hover:bg-indigo-800 focus:bg-indigo-800">
                    <Link href="/faq" className="w-full">
                      FAQ
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-gray-300 hover:bg-indigo-800 focus:bg-indigo-800">
                    <Link href="/contact" className="w-full">
                      Contact
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
              <Bell className="h-5 w-5" />
            </Button>
            {/* Thay thế Button Connect Wallet bằng component ConnectWallet của bạn */}
            <ConnectWallet />
          </div>
        </div>
      </div>
    </header>
  )
}

