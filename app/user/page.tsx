"use client";
import React, { useState, useEffect, useContext } from 'react';
import PagePagination from '@/components/PagePagination/PagePagination'; // Chú ý cách viết hoa chính xác

import NFT from '@/components/NFT';
import { AssetType } from '@/type/GenericsType';
import { getAllAsset } from '@/helpers/fetchAsset/fetchAssetsFromAddress';
import { toast } from 'react-toastify';
import { LucidContextType } from '@/type/LucidContextType';
import LucidContext from '@/context/components/LucidContext';
import { RiH1 } from 'react-icons/ri';

const Profile_Created = () => {
  const [assets, setAssets] = useState<AssetType[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6; // Số lượng items mỗi trang
  const { isConnected,refreshWallet, connectWallet, disconnectWallet, walletItem, setWalletItem, loadingConnectWallet,lucidNeworkPlatform } = useContext<LucidContextType>(LucidContext);
    
  
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
        } finally {
          toast.error("Lỗi khi tải tài sản!");
        }
      }
    };
    fetchDataAsset();
  }, [lucidNeworkPlatform, isConnected, walletItem.walletAddress]);
  // Giả sử bạn đã lấy được assets từ API hoặc một nguồn nào đó
  useEffect(() => {
    const fetchAssets = async () => {
      // Fetch data và setAssets theo cách của bạn
    };
    fetchAssets();
  }, []);

  // Tính toán các mục hiển thị cho mỗi trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = assets.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(assets.length / itemsPerPage);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-10 sm:px-20 gap-16 font-[family-name:var(--font-geist-sans)]">
  <main className="w-full max-w-7xl flex flex-col gap-10">
    {isConnected ? (
      <>
        <div id="area-bidding-list" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {currentItems.map((asset) => (
            <NFT
              key={`${asset.policy_id}_${asset.asset_name}`}
              name={asset.onchain_metadata?.name || ""}
              imgSrc={asset.onchain_metadata?.image || ""}
              policyId={asset.policy_id}
              assetName={asset.asset_name}
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
