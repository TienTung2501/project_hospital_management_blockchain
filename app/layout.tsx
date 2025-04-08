import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { LucidProvider } from "@/contexts/providers/LucidProvider"
import SmartContractProvider from "@/contexts/providers/SmartContractProvider"
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';


const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "NFT Marketplace",
  description: "NFT Marketplace platform",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-gradient-to-b from-indigo-950/90 to-blue-900/90 min-h-screen`}
      >
        <LucidProvider>
          <SmartContractProvider>
            <ThemeProvider attribute="class" defaultTheme="dark">
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow min-h-[500px]">
                  <div className="w-full max-w-6xl mx-auto px-4">
                    {children}
                  </div>
                </main>
                <Footer />
                <ToastContainer />
              </div>
            </ThemeProvider>
          </SmartContractProvider>
        </LucidProvider>
      </body>
    </html>
  );
}
