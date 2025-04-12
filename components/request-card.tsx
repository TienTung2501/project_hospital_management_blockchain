import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { medRecordRequest } from "@/types/GenericsType"; // <-- Đường dẫn đúng tới type của bạn
import { useContext, useState } from "react";
import convertIpfsAddressToUrl from "@/helpers/convertIpfsAddressToUrl";
import LucidContext from "@/contexts/components/LucidContext";
import { LucidContextType } from "@/types/LucidContextType";
import { toast } from "react-toastify";
import { sendGrant } from "@/actions/grantMedRecord";
import { useRouter } from "next/navigation";

interface RequestCardProps {
  request: medRecordRequest;
}

export default function RequestCard({ request }: RequestCardProps) {
  const { isConnected, refreshWallet, connectWallet, disconnectWallet, walletItem, setWalletItem, setIsLoading, loadingConnectWallet, lucidNeworkPlatform } = useContext<LucidContextType>(LucidContext);
  const router = useRouter();
  const [imageSrc, setImageSrc] = useState(
    request.documentLink ? convertIpfsAddressToUrl(request.documentLink) : "/placeholder.svg"
    );
  const handleGrant=async ()=>{
    try{
        setIsLoading (true)
        const { txHash } = await sendGrant({
          router,
          lucid: lucidNeworkPlatform,
          title: request.title,
          policyIdMedRecord: request.policyId,
          requestorAddress: request.requestorAddress,
          requestorPublicKey:request.requestorPublicKey,
          encryptKeyOnchain:request.encryptKey,
          encryptNonce:request.encryptNonce,
          ephemeralPublicKey:request.ephemeralPublicKey,
          hashCIP:request.hashCIP,
      });
      if(txHash){
        toast.success("Cấp quyền thành công!!!");
      }
      setIsLoading(false);
    }
    catch(e){
      console.log(e)
      toast.error("Không thể cấp quyền vì có lỗi!!!");
    }
  }
  const handleCancelGrant=()=>{
    console.log("info data: ",request)
  }
  const handleResponeAccess=()=>{
    if(!isConnected){
      toast.error("Vui lòng kết nối ví để thực hiện công việc!");
    }
    console.log("medRecord access: ",request)
  }
  const handleRevokeAccess=()=>{
    if(!isConnected){
      toast.error("Vui lòng kết nối ví để thực hiện công việc!");
    }
    console.log("medRecord access: ",request)
  }
  const handleView=()=>{
    console.log("info data: ",request)
  }
  return (
<div className="bg-indigo-900/30 rounded-xl p-4 backdrop-blur-sm">
  <div className="flex items-center gap-4">
    {/* Phần bên trái: Image */}
    <div className="w-16 h-16 relative rounded-md overflow-hidden flex-shrink-0">
      <img
        src={imageSrc || "/placeholder.svg"}
        alt={request.title || "name of asset"}
        onError={() => setImageSrc("/placeholder.svg")}
        className="object-cover w-full h-full rounded-t-xl"
      />
    </div>

    {/* Phần bên phải: Text và Button */}
    <div className="flex-grow flex flex-col justify-between">
      <div>
        <h3 className="font-medium text-white">Tên hồ sơ: {request.title}</h3>
        <p className="text-sm text-indigo-300">Ngày khám: {request.date}</p>
        <p className="text-sm text-indigo-300">Bệnh viện: {request.hospitalName}</p>
      </div>

      {/* Button */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
      <Button
        variant="outline"
        size="sm"
        className="border-teal-500 text-teal-400 hover:bg-teal-500/20 transition duration-200 ease-in-out"
        onClick={handleGrant}  // Gọi handleGrant ngay khi nhấn nút
      >
        <Eye className="h-4 w-4 mr-1" /> Cấp quyền
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="border-teal-500 text-teal-400 hover:bg-teal-500/20 transition duration-200 ease-in-out"
        onClick={handleCancelGrant}  // Gọi handleCancelGrant ngay khi nhấn nút
      >
        <Eye className="h-4 w-4 mr-1" /> Hủy quyền
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="border-teal-500 text-teal-400 hover:bg-teal-500/20 transition duration-200 ease-in-out"
        onClick={handleView}  // Gọi handleView ngay khi nhấn nút
      >
        <Eye className="h-4 w-4 mr-1" /> Xem hồ sơ
      </Button>

      </div>
    </div>
  </div>
</div>

  );
}
