"use client";
import React, { useState, useEffect, useContext } from 'react';
import NFTCard from '@/components/nft-card';
import { AssetType, medRecord } from '@/types/GenericsType';
import { getAllAsset } from '@/helpers/fetchAsset/fetchAssetsFromAddress';
import { toast } from 'react-toastify';
import { LucidContextType } from '@/types/LucidContextType';
import LucidContext from '@/contexts/components/LucidContext';
import { RiH1 } from 'react-icons/ri';
import { PagePagination } from '@/components/PagePagination';
import { Button } from '@/components/ui/button';
import mintTokenService from '@/services/cardano/mintoken';
import mintAsset from '@/services/cardano/mintAsset';

const Profile_Created = () => {
  const [assets, setAssets] = useState<medRecord[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [addressFix, setAddressFix] = useState<string>("");
  const itemsPerPage = 8; // Số lượng items mỗi trang
  const { isConnected,refreshWallet, connectWallet, disconnectWallet, walletItem, setWalletItem,setIsLoading, loadingConnectWallet,lucidNeworkPlatform } = useContext<LucidContextType>(LucidContext);
    
  
  useEffect(() => {
    const fetchDataAsset = async () => {
      if (lucidNeworkPlatform && isConnected && walletItem.walletAddress) {
        try {
          const assetData = await getAllAsset(walletItem.walletAddress);
          setAddressFix(walletItem.walletAddress);
          console.log("number asset:", assetData);
          setAssets(assetData);
        } catch (error) {
          console.log(error);
          toast.error("Không thể tải tài sản!");
        }
      }
    };
    fetchDataAsset();
    if(!isConnected)
      setAddressFix("");
  }, [lucidNeworkPlatform, isConnected, walletItem.walletAddress]);
  
  // Tính toán các mục hiển thị cho mỗi trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = assets.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(assets.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const handleSubmit = async () => {
    // Thu thập dữ liệu từ form


// Kiểm tra điều kiện trước khi gửi dữ liệu (ví dụ: nếu chưa kết nối ví, cần yêu cầu kết nối)
if (!lucidNeworkPlatform || walletItem.walletAddress === "") {
  toast.error("Làm ơn! Hãy kết nối ví trước khi thực hiện điều này");
  return;
}



try {
  // Minting asset (ví dụ: sử dụng API mintAsset)
  const mintRes = await mintAsset({
    lucid: lucidNeworkPlatform,
    title:"test mint token",
    label:1,
  });

  if (!mintRes.txHash) {
    throw new Error("Minting asset failed");
  }
  setIsLoading(false);
  toast.success("Minting asset successfully!");
} catch (error) {
  toast.error("Error during minting!");
} finally {
}
};
  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-10 sm:px-20 gap-16">
  <main className="w-full max-w-7xl flex flex-col gap-10">
    {isConnected ? (
      <>
        <Button
          variant="outline"
          className="w-full border-indigo-600/50 text-indigo-300 hover:bg-indigo-800"
          onClick={handleSubmit}
        >
          Mint token
        </Button>
        <div id="area-bidding-list" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {currentItems.map((asset) => (
            <NFTCard
                         key={asset.asset}
                         medRecord={{
                           asset: asset.asset || "", // assetName là tên của tài sản
                           assetName: asset.assetName || "", // assetName của asset (dạng hex)
                           policyId: asset.policyId || "", // policy_id của asset
                           mediaType: asset.mediaType || "", // mediaType trong onchain metadata
                           title: asset.title || "", // Tên tài sản trong metadata
                           date: asset.date || "", // Ngày khám từ metadata
                           hospitalName: asset.hospitalName || "", // Tên bệnh viện
                           hashCIP: asset.hashCIP || "", // hashCIP từ metadata
                           encryptKey: asset.encryptKey || "", // Encrypt key từ metadata
                           documentType: asset.documentType || "", // Loại tài liệu (medRecord)
                           documentLink: asset.documentLink || "", // Đường dẫn tài liệu IPFS
                           description: asset.description || "", // Mô tả tài liệu
                           ownerAddress:addressFix,
                         }}
                         isCardMedRecord={true} // Thêm thông tin cho loại card là medRecord
                       />
          ))}
        </div>
          
        <div id="area-pagination" className="flex justify-center pt-8">
          <PagePagination
            totalItems={assets.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </>
    ) : (
      <div className="mt-4 p-4 bg-gray-600 text-white rounded pt-4">
      Vui lòng connect ví để xem chi tiết!!!
    </div>
      
    )}
  </main>
</div>

  );
};

export default Profile_Created;
