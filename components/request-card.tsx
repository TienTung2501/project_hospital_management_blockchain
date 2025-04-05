import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"

interface RequestCardProps {
  request: {
    id: number
    name: string
    type: string
    image: string
  }
}

export default function RequestCard({ request }: RequestCardProps) {
  return (
    <div className="bg-indigo-900/30 rounded-xl p-4 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 relative rounded-md overflow-hidden flex-shrink-0">
          <Image src={request.image || "/placeholder.svg"} alt={request.name} fill className="object-cover" />
        </div>
        <div className="flex-grow">
          <h3 className="font-medium text-white">Tên hồ sơ</h3>
          <p className="text-sm text-indigo-300">{request.name}</p>
        </div>
        <div className="flex-shrink-0">
          <p className="text-sm text-teal-400 mb-2">Loại yêu cầu</p>
          <Button variant="outline" size="sm" className="border-teal-500 text-teal-400 hover:bg-teal-500/20 transition duration-200 ease-in-out">
            <Eye className="h-4 w-4 mr-1" /> Xem
          </Button>
        </div>
      </div>
    </div>
  )
}

