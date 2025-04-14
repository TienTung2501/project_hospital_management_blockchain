import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { medRecordRequest, UtxoGrant } from "@/types/GenericsType"; // <-- Đường dẫn đúng tới type của bạn
import { useContext, useState } from "react";
import convertIpfsAddressToUrl from "@/helpers/convertIpfsAddressToUrl";
import LucidContext from "@/contexts/components/LucidContext";
import { LucidContextType } from "@/types/LucidContextType";
import { toast } from "react-toastify";
import { cancelGrant, sendGrant } from "@/actions/grantMedRecord";
import { useRouter } from "next/navigation";
import { filterUtxoByPolicyIdFromAddress, filterUtxoByPolicyIdMedRecordFromGrantContract, getListUtxoFromGrantContractByAddress } from "@/helpers/findUtxoOnSmartContract";

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
      if(!isConnected){
        toast.error("Vui lòng kết nối ví để thực hiện công việc!");
        return;
      }
      if(walletItem.walletAddress&&isConnected){
            const utxoList:UtxoGrant[]=await getListUtxoFromGrantContractByAddress({
                      lucid: lucidNeworkPlatform,
                      addressRequestor: walletItem.walletAddress,
                    });
            const utxo= filterUtxoByPolicyIdMedRecordFromGrantContract(utxoList,request.policyId)
            if(utxo.length>0){
              toast.error("Hồ sơ đã cấp quyền quyền trước đó không cấp quyền nữa!!!");
              return;
            }
            let policyId: string | undefined;
      
            const utxosExist = await filterUtxoByPolicyIdFromAddress(
              lucidNeworkPlatform,
              request.assetName,
              request.policyId
            );
      
            if (utxosExist.length > 0) {
              const utxo = utxosExist[0]; // Lấy UTxO đầu tiên
              const units = Object.keys(utxo.assets); // [policyId + assetName]
      
              // Tìm unit có assetName trùng khớp để lấy policyId
              const matchedUnit = units.find((unit) => {
                const unitAssetNameHex = unit.slice(56); // phần assetName
                return unitAssetNameHex === request.assetName;
              });
      
              if (matchedUnit) {
                policyId = matchedUnit.slice(0, 56); // lấy phần policyId
              }
            }
            setIsLoading (true)
        const { txHash } = await sendGrant({
          router,
          lucid: lucidNeworkPlatform,
          title: request.title,
          policyId:policyId,
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
       
    }
    catch(e){
      console.log(e)
      toast.error("Không thể cấp quyền vì có lỗi!!!");
    }
  }
  const handleCancelGrantAccess=async ()=>{
      if(!isConnected){
        toast.error("Vui lòng kết nối ví để thực hiện công việc!");
      }
      if(walletItem.walletAddress&&isConnected){
        const utxoList:UtxoGrant[]=await getListUtxoFromGrantContractByAddress({
                  lucid: lucidNeworkPlatform,
                  addressGrantor: walletItem.walletAddress,
                });
        const utxo= filterUtxoByPolicyIdMedRecordFromGrantContract(utxoList,request.policyId)
        if(!utxo){
          toast.error("Bạn chưa cấp quyền nên không thể hủy!!!");
          return;
        }
        console.log(utxo);
        setIsLoading(true)
        const txHash  = await cancelGrant({
          lucid: lucidNeworkPlatform,
          assetName: utxo[0].assetName,
          policyId: utxo[0].policyId,
          grantorAddress: walletItem.walletAddress,
        });
        if(txHash){
          toast.success("Đã hủy yêu cầu thành công!!!");
        }
        setIsLoading(false);
      } 
    };
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

        <Eye className="h-4 w-4 mr-1" /> 
        {request.isGranted?"Đã cấp quyền":"Cấp quyền"}
      </Button>
      {
      request.isGranted&&
      <Button
      variant="outline"
      size="sm"
      className="border-teal-500 text-teal-400 hover:bg-teal-500/20 transition duration-200 ease-in-out"
      onClick={handleCancelGrantAccess}  // Gọi handleCancelGrant ngay khi nhấn nút
    >
      <Eye className="h-4 w-4 mr-1" /> Hủy quyền
    </Button>
      }
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
