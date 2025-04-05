import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"

interface NFTCardProps {
  nft: {
    id: number
    name: string
    description: string
    likes: number
    date: string
    image: string
  }
}

export default function NFTCard({ nft }: NFTCardProps) {
  return (
    <div className="bg-indigo-900/30 rounded-xl overflow-hidden backdrop-blur-sm">
      <div className="relative">
        <div className="aspect-square relative">
          <Image src={nft.image || "/placeholder.svg"} alt={nft.name} fill className="object-cover" />
        </div>
        <div className="absolute top-2 right-2 bg-indigo-900/80 rounded-full p-1">
          <Heart className="h-4 w-4 text-red-400 fill-red-400" />
        </div>
        <div className="absolute bottom-2 right-2 bg-indigo-900/80 rounded-full px-2 py-1 flex items-center">
          <Heart className="h-3 w-3 text-red-400 fill-red-400 mr-1" />
          <span className="text-xs text-white">{nft.likes}</span>
        </div>
      </div>
      <div className="p-4 space-y-2">
        <h3 className="font-medium text-white">{nft.name}</h3>
        <p className="text-sm text-gray-300">{nft.description}</p>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400">Ngày khám</span>
          <span className="text-gray-300">{nft.date}</span>
        </div>
        <Button variant="outline" className="w-full border-indigo-600/50 text-indigo-300 hover:bg-indigo-800">
          Xem chi tiết
        </Button>
      </div>
    </div>
  )
}

