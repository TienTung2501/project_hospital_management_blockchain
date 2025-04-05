import Image from "next/image"

interface NFTPreviewProps {
  image: string
  name: string
  description: string
  mediaType: string
}

export default function NFTPreview({ image, name, description, mediaType }: NFTPreviewProps) {
  return (
    <div className="bg-indigo-900/30 rounded-xl overflow-hidden backdrop-blur-sm">
      <div className="aspect-square relative">
        <Image src={image || "/placeholder.svg"} alt={name} fill className="object-cover" />
      </div>
      <div className="p-4 space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-white">Tên hồ sơ</h3>
          <span className="text-indigo-300">{mediaType}</span>
        </div>
        <p className="text-gray-300">{description}</p>
      </div>
    </div>
  )
}

