import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-6">NFT Marketplace</h1>
        <p className="text-xl text-gray-300 mb-8">Khám phá, mua, bán và tạo NFT độc đáo trên nền tảng của chúng tôi</p>
        <div className="flex justify-center gap-4">
          <Link href="/create">
            <Button className="bg-purple-600 hover:bg-purple-700">Tạo hồ sơ</Button>
          </Link>
          <Link href="/explore">
            <Button variant="outline" className="border-purple-500 text-purple-300 hover:bg-purple-800">
              Khám phá
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

