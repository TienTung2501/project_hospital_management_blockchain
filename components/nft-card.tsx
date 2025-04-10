"use client";
import { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

import LucidContext from "@/contexts/components/LucidContext";
import { LucidContextType } from "@/types/LucidContextType";
import { medRecord, UtxoRequest } from "@/types/GenericsType";
import convertIpfsAddressToUrl from "@/helpers/convertIpfsAddressToUrl";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { cancelRequest, sendRequest } from "@/actions/requestMedRecord";
import { Lucid } from "lucid-cardano";
import { filterUtxoByPolicyIdFromAddress, filterUtxoByPolicyIdMedRecordFromRequestContract, getListUtxoFromRequestContractByAddress, getUtxoFromGrantContractByAddress } from "@/helpers/findUtxoOnSmartContract";

type NFTCardProps = {
  medRecord: medRecord;  // Sử dụng medRecord làm prop chính
  isCardRequest?: boolean;
  isCardRespone?: boolean;
  isCardMedRecord?: boolean;
};

export default function NFTCard({
  medRecord,
  isCardRequest,
  isCardRespone,
  isCardMedRecord,
}: NFTCardProps) {
  const [imageSrc, setImageSrc] = useState(
    medRecord.documentLink ? convertIpfsAddressToUrl(medRecord.documentLink) : "/placeholder.svg"
  );
  const router = useRouter();

  const { isConnected, refreshWallet, connectWallet, disconnectWallet, walletItem, setWalletItem, setIsLoading, loadingConnectWallet, lucidNeworkPlatform } = useContext<LucidContextType>(LucidContext);
  const handleRequestAccess=async ()=>{
    if(!isConnected){
      toast.error("Vui lòng kết nối ví để thực hiện công việc!");
      return;
    }
    if(walletItem.walletAddress&&isConnected){
      const utxoList:UtxoRequest[]=await getListUtxoFromRequestContractByAddress(lucidNeworkPlatform,walletItem.walletAddress)
      const utxo= filterUtxoByPolicyIdMedRecordFromRequestContract(utxoList,medRecord.policyId)
      if(utxo.length>0){
        toast.error("Hồ sơ đã được yêu cầu quyền trước đó không cần yêu cầu nữa!!!");
        return;
      }
      let policyId: string | undefined;

      const utxosExist = await filterUtxoByPolicyIdFromAddress(
        lucidNeworkPlatform,
        medRecord.assetName,
        medRecord.policyId
      );

      if (utxosExist.length > 0) {
        const utxo = utxosExist[0]; // Lấy UTxO đầu tiên
        const units = Object.keys(utxo.assets); // [policyId + assetName]

        // Tìm unit có assetName trùng khớp để lấy policyId
        const matchedUnit = units.find((unit) => {
          const unitAssetNameHex = unit.slice(56); // phần assetName
          return unitAssetNameHex === medRecord.assetName;
        });

        if (matchedUnit) {
          policyId = matchedUnit.slice(0, 56); // lấy phần policyId
        }
      }
      setIsLoading (true)
      const { txHash } = await sendRequest({
        lucid: lucidNeworkPlatform,
        title: medRecord.title,
        policyId:policyId,
        policyIdMedRecord: medRecord.policyId,
        ownerAddress: medRecord.ownerAddress,
        requestorAddress: walletItem.walletAddress,
      });
      if(txHash){
        toast.success("Yêu cầu thành công vui lòng đợi phản hồi từ chủ hồ sơ");
      }
      setIsLoading(false);
    } 
  }
  const handleCancelRequestAccess=async ()=>{
    if(!isConnected){
      toast.error("Vui lòng kết nối ví để thực hiện công việc!");
    }
    if(walletItem.walletAddress&&isConnected){
      const utxoList:UtxoRequest[]=await getListUtxoFromRequestContractByAddress(lucidNeworkPlatform,walletItem.walletAddress)
      const utxo= filterUtxoByPolicyIdMedRecordFromRequestContract(utxoList,medRecord.policyId)
      if(!utxo){
        toast.error("Bạn chưa yêu cầu nên không thể hủy!!!");
        return;
      }
      setIsLoading(true)
      const txHash  = await cancelRequest({
        lucid: lucidNeworkPlatform,
        assetName: utxo[0].assetName,
        policyId: utxo[0].policyId,
        requestorAddress: walletItem.walletAddress,
      });
      if(txHash){
        toast.success("Đã hủy yêu cầu thành công!!!");
      }
      setIsLoading(false);
    } 
  }
  const handleResponeAccess=()=>{
    if(!isConnected){
      toast.error("Vui lòng kết nối ví để thực hiện công việc!");
    }
    console.log("medRecord access: ",medRecord)
  }
  const handleRevokeAccess=()=>{
    if(!isConnected){
      toast.error("Vui lòng kết nối ví để thực hiện công việc!");
    }
    console.log("medRecord access: ",medRecord)
  }
  return (
<div className="bg-indigo-900/30 rounded-xl overflow-hidden backdrop-blur-sm flex flex-col">
  <div className="relative">
    <div className="aspect-square relative">
      <img
        src={imageSrc || "/placeholder.svg"}
        alt={medRecord.title || "name of asset"}
        onError={() => setImageSrc("/placeholder.svg")}
        className="object-cover w-full h-full rounded-t-xl"
      />
    </div>
    <div className="absolute top-2 right-2 bg-indigo-900/80 rounded-full p-1">
      <Heart className="h-4 w-4 text-red-400 fill-red-400" />
    </div>
    <div className="absolute bottom-2 right-2 bg-indigo-900/80 rounded-full px-2 py-1 flex items-center">
      <Heart className="h-3 w-3 text-red-400 fill-red-400 mr-1" />
      <span className="text-xs text-white">100</span>
    </div>
  </div>

  {/* Nội dung & nút */}
  <div className="flex flex-col justify-between flex-1 p-4">
    <div className="space-y-2">
    <h3 className="font-medium text-white line-clamp-2 min-h-[3rem]">
      {medRecord.title}
    </h3>
    <p className="text-sm text-gray-300 line-clamp-1 min-h-[1.5rem]">
      {medRecord.hospitalName}
    </p>
    <div className="flex justify-between items-center text-sm">
      <span className="text-gray-400">Ngày khám</span>
      <span className="text-gray-300">{medRecord.date}</span>
    </div>
  </div>


    {/* Buttons luôn nằm dưới cùng */}
    <div className="mt-4 space-y-2">
      <Button
        variant="outline"
        className="w-full border-indigo-600/50 text-indigo-300 hover:bg-indigo-800"
        onClick={() => router.push(`/show/${medRecord.hashCIP}?param=${medRecord.encryptKey}`)}
      >
        Xem chi tiết
      </Button>
      <Button
        variant="outline"
        className="w-full border-indigo-600/50 text-indigo-300 hover:bg-indigo-800"
        onClick={handleRequestAccess}
      >
        Yêu cầu xem
      </Button>
      <Button
        variant="outline"
        className="w-full border-indigo-600/50 text-indigo-300 hover:bg-indigo-800"
        onClick={handleCancelRequestAccess}
      >
        Hủy yêu cầu
      </Button>
      <Button
        variant="outline"
        className="w-full border-indigo-600/50 text-indigo-300 hover:bg-indigo-800"
        onClick={handleResponeAccess}
      >
        Cấp quyền
      </Button>
      <Button
        variant="outline"
        className="w-full border-indigo-600/50 text-indigo-300 hover:bg-indigo-800"
        onClick={handleRevokeAccess}
      >
        Thu hồi
      </Button>
    </div>
  </div>
</div>

  );
}
