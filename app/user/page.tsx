"use client";
import React, { useState, useEffect, useContext } from 'react';
import NFTCard from '@/components/nft-card';
import { AssetType, medRecord, medRecordRequest } from '@/types/GenericsType';
import { getAllAsset } from '@/helpers/fetchAsset/fetchAssetsFromAddress';
import { toast } from 'react-toastify';
import { LucidContextType } from '@/types/LucidContextType';
import LucidContext from '@/contexts/components/LucidContext';
import { RiH1 } from 'react-icons/ri';
import { PagePagination } from '@/components/PagePagination';
import { Button } from '@/components/ui/button';
import mintTokenService from '@/services/cardano/mintoken';
import mintAsset from '@/services/cardano/mintAsset';
import { getListUtxoFromGrantContractByAddress, getListUtxoFromRequestContractByAddress } from '@/helpers/findUtxoOnSmartContract';
import RequestCard from '@/components/request-card';

const Profile_Created = () => {
  const [assets, setAssets] = useState<medRecord[]>([]);
  const [assetRequests, setAssetRequests] = useState<medRecordRequest[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [addressFix, setAddressFix] = useState<string>("");
  const itemsPerPage = 8; // Số lượng items mỗi trang
  const {isConnected,refreshWallet, connectWallet, disconnectWallet, walletItem, setWalletItem,setIsLoading, loadingConnectWallet,lucidNeworkPlatform } = useContext<LucidContextType>(LucidContext);
  const [notification, setNotification] = useState<string>("");
  
  useEffect(() => {
    const fetchDataAsset = async () => {
      
      if (lucidNeworkPlatform && isConnected && walletItem.walletAddress) {
        try {
          setIsLoading(true)
          const assetData = await getAllAsset(walletItem.walletAddress);

          const utxosRequest = await getListUtxoFromRequestContractByAddress({
            lucid: lucidNeworkPlatform,
            addressGrantor: walletItem.walletAddress,
          });

          const utxosGrant = await getListUtxoFromGrantContractByAddress({
            lucid: lucidNeworkPlatform,
            addressGrantor: walletItem.walletAddress,
          });

          const medRecordRequests: medRecordRequest[] = [];

          for (const utxo of utxosRequest) {
            const matchedAsset = assetData.find(
              (record) => record.policyId === utxo.policyIdMedRecord
            );

            if (matchedAsset) {
              // Kiểm tra xem utxo này có được cấp quyền chưa
              const isGranted = utxosGrant.some(
                (grant) => grant.policyIdMedRecord === utxo.policyIdMedRecord
              );

              medRecordRequests.push({
                ...matchedAsset,
                policyIdMedRecord: utxo.policyIdMedRecord,
                requestorAddress: utxo.requestorAddress,
                requestorPublicKey: utxo.requestorPublicKey,
                isGranted, // true nếu đã cấp quyền, false nếu chưa
              });
            }
          }

          console.log(assetData)
          setAssetRequests(medRecordRequests);
          setAddressFix(walletItem.walletAddress);
          setAssets(assetData);
          setIsLoading(false)
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
  

return (
  <div className="flex flex-col items-center min-h-screen px-4 py-10 sm:px-20 gap-16">
    <main className="w-full max-w-7xl flex flex-col gap-10">
      {isConnected ? (
        <>
          {assetRequests.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">Danh sách yêu cầu</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {assetRequests.map((request) => (
                  <RequestCard key={request.asset} request={request} />
                ))}
              </div>
              <div className="text-center mt-6">
                <div id="area-pagination" className="flex justify-center pt-8">
                  <PagePagination
                    totalItems={assetRequests.length}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                  />
                </div>
              </div>
            </section>
          )}

          {
            assets.length>0&&
            <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Danh sách hồ sơ</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {currentItems.map((asset) => (
                <NFTCard
                  key={asset.asset}
                  medRecord={{
                    asset: asset.asset || "",
                    assetName: asset.assetName || "",
                    policyId: asset.policyId || "",
                    mediaType: asset.mediaType || "",
                    title: asset.title || "",
                    date: asset.date || "",
                    hospitalName: asset.hospitalName || "",
                    hashCIP: asset.hashCIP || "",
                    encryptKey: asset.encryptKey || "",
                    documentType: asset.documentType || "",
                    documentLink: asset.documentLink || "",
                    description: asset.description || "",
                    ephemeralPublicKey: asset.ephemeralPublicKey || "",
                    encryptNonce: asset.encryptNonce || "",
                    ownerAddress: addressFix,
                  }}
                  isCardMedRecord={true}
                />
              ))}
              <div id="area-pagination" className="flex justify-center pt-8">
                <PagePagination
                  totalItems={assets.length}
                  itemsPerPage={itemsPerPage}
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                />
              </div>
            </div>
          </section>
          }
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
