import NFTCard from "@/components/nft-card"
import RequestCard from "@/components/request-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ExplorePage() {
  // Mẫu dữ liệu cho danh sách yêu cầu
  const requests = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    name: `Address_nft_${i + 1}`,
    type: "Loại yêu cầu",
    image: "/images/nft-preview.jpg",
  }))

  // Mẫu dữ liệu cho danh sách hồ sơ
  const nfts = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    name: "Đồ yêu cầu",
    description: "Description",
    likes: 300,
    date: "20/20/2025",
    image: "/images/nft-card.jpg",
  }))

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-12">
        <div className="relative h-64 rounded-xl overflow-hidden mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/80 to-transparent z-10"></div>
          <div className="absolute inset-0 bg-[url('/images/banner.jpg')] bg-cover bg-center"></div>
          <div className="absolute inset-0 flex items-center z-20 p-8">
            <div className="max-w-lg">
              <h1 className="text-3xl font-bold text-white mb-2">Thông tin ví</h1>
              <p className="text-gray-200 mb-6">Xem các hồ sơ và quản lý quyền truy cập</p>
              <Link href="/create">
                <Button className="bg-blue-600 hover:bg-blue-700">Tạo hồ sơ</Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 text-white">
          <div className="bg-indigo-900/30 rounded-lg px-4 py-2 backdrop-blur-sm">
            <span className="text-gray-400 text-sm">Tổng số hồ sơ:</span>
            <span className="ml-2 font-medium">10</span>
          </div>
          <div className="bg-indigo-900/30 rounded-lg px-4 py-2 backdrop-blur-sm">
            <span className="text-gray-400 text-sm">Số yêu cầu:</span>
            <span className="ml-2 font-medium">30</span>
          </div>
          <div className="bg-indigo-900/30 rounded-lg px-4 py-2 backdrop-blur-sm">
            <span className="text-gray-400 text-sm">Đã dùng:</span>
            <span className="ml-2 font-medium">15</span>
          </div>
        </div>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">Danh sách yêu cầu</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {requests.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
        </div>
        <div className="text-center mt-6">
        <Button
          variant="outline"
          className="border-indigo-600/50 text-indigo-300 hover:bg-indigo-600/20 hover:text-indigo-100 hover:scale-105 transform transition duration-200 ease-in-out"
        >
          View More
        </Button>

        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-white mb-6">Danh sách hồ sơ</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {nfts.map((nft) => (
            <NFTCard 
            key={nft.id}  
            name={nft.name}
            description={nft.description}
            likes={nft.likes}
            date={nft.date}
            image={nft.image}
            />
          ))}
        </div>
        <div className="flex justify-center mt-8 gap-2">
          {[1, 2, 3, 4, 5, 6, 7].map((page) => (
            <Button
              key={page}
              variant={page === 1 ? "default" : "outline"}
              size="icon"
              className={
                page === 1 ? "bg-blue-600 hover:bg-blue-700 h-8 w-8" : "border-indigo-600/50 text-indigo-300 h-8 w-8"
              }
            >
              {page}
            </Button>
          ))}
        </div>
      </section>
    </div>
  )
}

