"use client";
import React, { useState, useEffect, useContext } from 'react';
import NFTCard from '@/components/nft-card';
import { AssetType } from '@/types/GenericsType';
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
  const [assets, setAssets] = useState<AssetType[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8; // Số lượng items mỗi trang
  const { isConnected,refreshWallet, connectWallet, disconnectWallet, walletItem, setWalletItem,setIsLoading, loadingConnectWallet,lucidNeworkPlatform } = useContext<LucidContextType>(LucidContext);
    
  
  useEffect(() => {
    const fetchDataAsset = async () => {
      if (lucidNeworkPlatform && isConnected && walletItem.walletAddress) {
        try {
          const assetData = await getAllAsset(walletItem.walletAddress);
          console.log("number asset:", assetData);
          setAssets(assetData);
        } catch (error) {
          console.log(error);
          toast.error("Không thể tải tài sản!");
        }
      }
    };
    fetchDataAsset();
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
              key={`${asset.policy_id}_${asset.asset_name}`}
              name={asset.onchain_metadata?.name || ""}
              imgSrc={asset.onchain_metadata?.image || ""}
              policyId={asset.policy_id||""}
              assetName={asset.asset_name||""}
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
      <h1 className="flex justify-center items-center">Vui lòng connect ví để xem chi tiết</h1>
    )}
  </main>
</div>

  );
};

export default Profile_Created;
