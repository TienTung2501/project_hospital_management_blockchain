"use client";
import React, { useState, useContext } from 'react';
import NFTCard from '@/components/nft-card';
import { AssetType, medRecord, UtxoRequest } from '@/types/GenericsType';
import { getAllAsset } from '@/helpers/fetchAsset/fetchAssetsFromAddress';
import { LucidContextType } from '@/types/LucidContextType';
import LucidContext from '@/contexts/components/LucidContext';
import { Button } from "@/components/ui/button";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { PagePagination } from '@/components/PagePagination';
import Link from "next/link";
import { toast } from 'react-toastify';
import { filterUtxoByPolicyIdMedRecordFromRequestContract, getListUtxoFromRequestContractByAddress } from '@/helpers/findUtxoOnSmartContract';
import { cancelRequest } from '@/actions/requestMedRecord';

export default function Home() {
  const [assets, setAssets] = useState<medRecord[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchValue, setSearchValue] = useState<string>("");
  const [addressFix, setAddressFix] = useState<string>("");
  const [notification, setNotification] = useState<string>("");
  const [isCanCancel, setIsCanCancel] = useState<boolean>(false);
  const { isConnected, refreshWallet, connectWallet, disconnectWallet, walletItem, setWalletItem, setIsLoading, loadingConnectWallet, lucidNeworkPlatform } = useContext<LucidContextType>(LucidContext);
  const itemsPerPage = 8; // Số lượng items mỗi trang
  // Theo dõi định kỳ xem có thể huỷ hay không
  React.useEffect(() => {
    if (!lucidNeworkPlatform || !walletItem.walletAddress) return;
  
    const interval = setInterval(async () => {
      try {
        const utxos = await getListUtxoFromRequestContractByAddress(
          lucidNeworkPlatform!,
          walletItem.walletAddress!
        );
        setIsCanCancel(utxos.length > 0);
      } catch (error) {
        console.error("Lỗi khi kiểm tra UTxO:", error);
        setIsCanCancel(false);
      }
    }, 10000);
  
    (async () => {
      try {
        const utxos = await getListUtxoFromRequestContractByAddress(
          lucidNeworkPlatform!,
          walletItem.walletAddress!
        );
        setIsCanCancel(utxos.length > 0);
      } catch (error) {
        console.error("Lỗi khi kiểm tra UTxO lần đầu:", error);
        setIsCanCancel(false);
      }
    })();
  
    return () => clearInterval(interval);
  }, [lucidNeworkPlatform, walletItem.walletAddress]);
  
  const submitAddress = async () => {
    setAssets([]);
    setAddressFix("");
    setIsCanCancel(false); // Reset ban đầu
  
    if (lucidNeworkPlatform&&walletItem.walletAddress) {
      setIsLoading(true);
      if (searchValue) {
        if (searchValue.trim().toLowerCase() === walletItem.walletAddress?.toLowerCase()) {
          setNotification("Đây là ví của bạn. Không cần cấp quyền xem hồ sơ!!! Vui lòng nhập ví khác để truy cập hồ sơ.");
          setIsLoading(false);
          return;
        }
  
        try {
          const assetData = await getAllAsset(searchValue);
          const utxos = await getListUtxoFromRequestContractByAddress(lucidNeworkPlatform, walletItem.walletAddress);
  
          if (utxos && utxos.length > 0) {
            setIsCanCancel(true);
          } else {
            setIsCanCancel(false);
          }
  
          if (assetData && assetData.length > 0) {
            setAddressFix(searchValue);
            setAssets(assetData);
            setNotification("");
          } else {
            setNotification("Không có hồ sơ nào hoặc địa chỉ không hợp lệ.");
          }
        } catch (error) {
          console.log(error);
          setNotification("Không thể tải tài sản! Địa chỉ nhập không hợp lệ hoặc lỗi dữ liệu onchain!!!");
        }
  
        setIsLoading(false);
      } else {
        setNotification("Vui lòng nhập địa chỉ ví hợp lệ.");
      }
    }
  };
  

  const handleCancelAllRequest=async ()=>{
    if(!isConnected){
      toast.error("Vui lòng kết nối ví để thực hiện công việc!");
    }
    if(walletItem.walletAddress&&isConnected){
     
      setIsLoading(true)
      const txHash  = await cancelRequest({
        lucid: lucidNeworkPlatform,
        requestorAddress: walletItem.walletAddress,
        cancelAll:true,
      });
      if(txHash){
        toast.success("Đã hủy yêu cầu thành công!!!");
        setIsCanCancel(false);
      }
      setIsLoading(false);
    } 
  }

  // Tính toán các mục hiển thị cho mỗi trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = assets.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(assets.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto px-4 py-12 w-full">
      <div className="text-center border-b-2 border-purple-600 pb-8">
        <h1 className="text-4xl font-bold text-white mb-6">Nền tảng quản lý hồ sơ y tế</h1>
        <p className="text-xl text-gray-300 mb-8">Quản lý lưu trữ, quản lý truy cập hồ sơ y tế</p>
        <div className="flex justify-center gap-4">
          <Link href="/create">
            <Button className="bg-purple-600 hover:bg-purple-700">Tạo hồ sơ</Button>
          </Link>
          <Link href="/explore">
            <Button variant="outline" className="border-purple-500 text-purple-300 hover:bg-purple-800">
              Khám phá
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex items-center space-x-4 pt-6">
  <div className="space-y-2 w-full">
    <Label htmlFor="name" className="text-white">
      Nhập địa chỉ ví chứa hồ sơ muốn truy cập!!!
    </Label>
    <Input
      id="address_wallet"
      placeholder="Địa chỉ ví"
      className="bg-indigo-900/30 border-indigo-600/50 text-white"
      value={searchValue}
      onChange={(e) => setSearchValue(e.target.value)}
      required
    />
  </div>
  
  <Button
    variant="outline"
    className="border-indigo-600/50 text-indigo-300 hover:bg-indigo-800 w-auto mt-6"
    onClick={submitAddress}
  >
    Submit
  </Button>
      </div>

      
      {/* Thêm thẻ thông báo */}
      {notification && (
        <div className="mt-4 p-4 bg-gray-600 text-white rounded pt-4">
          {notification}
        </div>
      )}


      {assets?.length > 0 && (
        <div className="mt-6 p-4 bg-gray-600 rounded-lg shadow-md text-center space-y-4">
          <p className="text-xl text-gray-300">📋 Danh sách các hồ sơ y tế của địa chỉ ví</p>
          {isConnected&&isCanCancel&&
          <Button
          variant="outline"
          className="w-full sm:w-1/2 mx-auto border-indigo-600/50 text-indigo-300 hover:bg-indigo-800"
          onClick={handleCancelAllRequest}
        >
          ❌ Hủy tất cả yêu cầu
        </Button>
          }
        </div>
      )}

      
      <div id="area-bidding-list" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 pt-4">
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
    </div>
  );
}
