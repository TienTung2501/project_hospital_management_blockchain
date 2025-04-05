import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Youtube, Twitter, Send } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-indigo-950/80 border-t border-indigo-800/50 pt-12 pb-6">
      <div className="container mx-auto px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <Link href="/" className="mb-4 inline-block">
              <div className="bg-indigo-800/80 text-white font-bold p-4 h-16 w-24 flex items-center justify-center">
                Logo
              </div>
            </Link>
            <div className="mt-4">
              <Button variant="link" className="text-gray-400 hover:text-white p-0 h-auto">
                English
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-white font-medium mb-4">Auction Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/explore" className="text-gray-400 hover:text-white transition-colors">
                  Biding
                </Link>
              </li>
              <li>
                <Link href="/create" className="text-gray-400 hover:text-white transition-colors">
                  Create
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-medium mb-4">Useful Link</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/guide" className="text-gray-400 hover:text-white transition-colors">
                  Guide
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/policy" className="text-gray-400 hover:text-white transition-colors">
                  Police Temp
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-medium mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/blogs" className="text-gray-400 hover:text-white transition-colors">
                  Blogs
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-gray-400 hover:text-white transition-colors">
                  Community
                </Link>
              </li>
              <li>
                <Link href="/coming-soon" className="text-gray-400 hover:text-white transition-colors">
                  Comming Soon
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-indigo-800/50 pt-6 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-white font-medium mb-2">FeedBack</h3>
              <div className="flex">
                <Input
                  placeholder="Your Email"
                  className="bg-indigo-900/50 border-indigo-700 text-white rounded-r-none"
                />
                <Button className="bg-blue-600 hover:bg-blue-700 rounded-l-none">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex space-x-4">
              <Button variant="outline" size="icon" className="border-indigo-600 text-indigo-300 hover:bg-indigo-800">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" className="border-indigo-600 text-indigo-300 hover:bg-indigo-800">
                <Youtube className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" className="border-indigo-600 text-indigo-300 hover:bg-indigo-800">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" className="border-indigo-600 text-indigo-300 hover:bg-indigo-800">
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <div className="mt-6 text-right text-gray-400 text-sm">
            <p>Design by: TienTung</p>
            <p>Contact me: tientung03.nttvn@gmail.com</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

