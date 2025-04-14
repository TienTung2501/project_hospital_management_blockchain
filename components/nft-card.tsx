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
import { filterUtxoByPolicyIdFromAddress, filterUtxoByPolicyIdMedRecordFromRequestContract, getListUtxoFromRequestContractByAddress } from "@/helpers/findUtxoOnSmartContract";
import { handleViewProcessing } from "@/actions/viewProcessing/handleViewProcessing";
import { getEcPrivateKeyByAddress, getX25519PrivateKeyByAddress } from "@/utils/test/getKey";

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
      const utxoList:UtxoRequest[]=await getListUtxoFromRequestContractByAddress({
                lucid: lucidNeworkPlatform,
                addressRequestor: walletItem.walletAddress,
              });
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
        ownerAddress: medRecord.ownerAddress!,
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
      const utxoList:UtxoRequest[]=await getListUtxoFromRequestContractByAddress({
                lucid: lucidNeworkPlatform,
                addressRequestor: walletItem.walletAddress,
              });
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
  const isOwner = (medRecord: medRecord, walletAddress: string): boolean => {
    // Kiểm tra xem ownerAddress có tồn tại và so sánh
    return medRecord.ownerAddress?.toLowerCase() === walletAddress.toLowerCase();
  };
  const handleView = async () => {
    try {
      // Lấy khóa riêng từ ví
      setIsLoading(true);
      const privateEcKey = await getEcPrivateKeyByAddress(walletItem.walletAddress!);
      const privateX25519Key = await getX25519PrivateKeyByAddress(walletItem.walletAddress!);
  
      // Kiểm tra người dùng có phải chủ sở hữu hồ sơ không
      const isOwnerFlag = isOwner(medRecord, walletItem.walletAddress!);
      // Gửi yêu cầu đến API để xử lý giải mã
      if (medRecord.encryptNonceGranted || medRecord.encryptAesKeyGranted||isOwnerFlag){
        const response = await fetch(`/api/viewProcessing`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          
          body: JSON.stringify({
            userPrivateKey: isOwnerFlag ? privateX25519Key : privateEcKey,
            encryptKey: isOwnerFlag ? medRecord.encryptKey : "",
            encryptNonce: isOwnerFlag ? medRecord.encryptNonce : "",
            ephemeralPublicKey: isOwnerFlag ? medRecord.ephemeralPublicKey : "",
            encryptAesKeyGranted: !isOwnerFlag ? medRecord.encryptAesKeyGranted : "",
            encryptNonceGranted: !isOwnerFlag ? medRecord.encryptNonceGranted : "",
            publicKeyEcGrant: !isOwnerFlag ? medRecord.publicKeyEcGrant : "",
            ipfsCid: medRecord.hashCIP,
          }),
        });
        const data = await response.json();

        if (data.success && data.data) {
          const byteCharacters = atob(data.data);
          const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'application/pdf' }); // hoặc thay đổi type nếu cần
          const blobUrl = URL.createObjectURL(blob);
        
          localStorage.setItem("decryptedFileUrl", blobUrl);
          
        }
      }
      setIsLoading(false);
      router.push(`/show/${medRecord.hashCIP}`);
      

    } catch (error) {
      // Bắt lỗi và log ra console
      console.error("Lỗi xảy ra khi xử lý xem:", error);
      toast.error("Đã xảy ra lỗi trong quá trình xử lý.");
    }
  };
  
  
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
        // onClick={() => router.push(`/show/${medRecord.hashCIP}?param=${medRecord.encryptKey}`)}
        onClick={handleView}
      >
        Xem chi tiết
      </Button>
      {
        isCardRequest&&
        <div>
         <Button
          variant="outline"
          className="w-full border-indigo-600/50 text-indigo-300 hover:bg-indigo-800"
          onClick={handleRequestAccess}
          disabled={medRecord.isRequested || !!medRecord.encryptNonceGranted}
        >
          {medRecord.isRequested ? (
            medRecord.encryptNonce
              ? "Đã được cấp quyền"
              : "Đã yêu cầu! Đợi phản hồi"
          ) : (
            "Yêu cầu xem"
          )}
        </Button>

        {medRecord.isRequested && (
            <Button
              variant="outline"
              className="w-full border-indigo-600/50 text-indigo-300 hover:bg-indigo-800"
              onClick={
                medRecord.encryptNonceGranted
                  ? () => toast.error("Không thể hủy! Hồ sơ đã được cấp quyền.")
                  : handleCancelRequestAccess
              }
              disabled={!!medRecord.encryptNonceGranted}
            >
              Hủy yêu cầu
            </Button>
          )}
        </div>
      }
     
    </div>
  </div>
</div>

  );
}
