'use client';

import React, { useContext, useEffect, useState } from 'react';
import { LucidContextType } from '@/type/LucidContextType';
import LucidContext from '@/context/components/LucidContext';
import wallets from '@/constant/wallet';
import Image from 'next/image';
import images from '@/public/assets';
import { WalletItemType } from '@/type/GenericsType';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';
import { MdLogout, MdOutlineRemoveRedEye, MdRefresh } from 'react-icons/md';
import { Tooltip } from '@mui/material';
import { toast } from 'react-toastify';

const ConnectWallet = () => {
  const { isConnected,refreshWallet, connectWallet, disconnectWallet, walletItem, setWalletItem, loadingConnectWallet } = useContext<LucidContextType>(LucidContext);
  const [activeWallet, setActiveWallet] = useState(false);
  const [isShowWallet, setIsShowWallet] = useState(false);

  const handleShowSellectWallet = () => {
    setActiveWallet(!activeWallet) ;
  };

  const handleShowInforWallet = () => {
    setIsShowWallet(!isShowWallet);
  };
  
  const handleConnectWallet = async (wallet: WalletItemType) => {
    try {
      
      setActiveWallet(false); // Ẩn danh sách ví khi chọn ví
      if (!(await wallet.walletCheckApi())) {
        setWalletItem((walletPrevious: WalletItemType) => ({
          ...walletPrevious,
          walletDownloadApi: wallet.walletDownloadApi,
          walletName: wallet.walletName,
          id: wallet.id,
        }));
      }

      // Kết nối ví
      await connectWallet({
        id: wallet.id,
        walletApi: wallet.walletApi,
        walletCheckApi: wallet.walletCheckApi,
        walletName: wallet.walletName,
        walletImage: wallet.walletImage,
      });

    

      const walletAddress = walletItem.walletAddress;
      if (!walletAddress) throw new Error('Cannot read wallet address');

      toast.success('Connected wallet!', {
        position: 'top-right',
      });
    } catch (error) {
      console.error(error);
      toast.error('Connected wallet failed!', {
        position: 'top-right',
      });
    }
  };

  const handleDisconnecWallet = async () => {
    try {
      setIsShowWallet(false); // Ẩn thông tin ví khi ngắt kết nối
      await disconnectWallet();
    } catch (error) {
      console.error(error);
      toast.error('Disconnecting failed!', {
        position: 'top-right',
      });
    }
  };
  // Auto refresh
  // useEffect(() => {
  //   const fetchWallet = async () => {
  //     try {
  //       // Kiểm tra nếu ví đã kết nối, nếu chưa thì mới gọi refreshWallet
  //       if (!isConnected) {
  //         await refreshWallet();
  //       }
  //     } catch (error: any) {
  //       toast.warning(error.message || 'Cannot refresh wallet!');
  //     }
  //   };
  //   if (walletItem && !isConnected) {
  //     fetchWallet();
  //   }
  // }, [walletItem, isConnected]);
  

  return (
    <div className="relative z-30 ms-1.5">
      {isConnected===false ? (
        <div
          className="flex justify-between items-center rounded-[40px] bg-fog-1 px-4 py-1.5 border border-white hover:bg-purple-3"
          onClick={handleShowSellectWallet}
        >
          Connect Wallet &nbsp; {activeWallet===true ? <FaCaretUp /> : <FaCaretDown />}
        </div>
      ) : (
        <div
          className="flex justify-between items-center rounded-[40px] bg-fog-1 px-4 py-1.5 border border-white hover:bg-purple-3"
          onClick={handleShowInforWallet}
        >
          <div className="flex items-center">
            {loadingConnectWallet===true ? (
              <span className="visually-hidden">Connecting...</span>
            ) : (
              <>
                <div className="h-5 w-5 overflow-hidden me-3">
                  <Image src={walletItem.walletImage} alt="" width={20} height={20} />
                </div>
                <span>{walletItem.walletBalance}&nbsp;₳&nbsp;</span>
                {activeWallet ? <FaCaretUp /> : <FaCaretDown />}
              </>
            )}
          </div>
        </div>
      )}

      {activeWallet===true && (
        <div className="absolute mt-4 right-0 bg-white text-purple-1 w-40 rounded-md">
          <ul className="py-3">
            {wallets.slice(0, 5).map((wallet, index) => (
              <li
                className="flex items-center px-3 py-2 hover:bg-purple-3 hover:text-purple-6"
                key={index}
                onClick={() => handleConnectWallet(wallet)}
              >
                <div className="h-5 w-5 overflow-hidden me-3">
                  <Image src={wallet.walletImage} alt="" width={20} height={20} />
                </div>
                <div id="user-name" className='text-gray-500'>{wallet.walletName}</div>
              </li>
            ))}
            <li className="border-t my-2"></li>
            <li className="flex items-center px-3 hover:text-purple-6">
              <MdOutlineRemoveRedEye size="1.2em" className="me-3" />
              <div id="user-name">View All</div>
            </li>
          </ul>
        </div>
      )}

      {isShowWallet===true && (
        <div className="absolute mt-4 right-0 bg-white text-purple-1 w-48 rounded-md">
          <ul className="py-3">
            <li className="flex items-center px-3  text-gray-500 py-2 hover:bg-purple-3 hover:text-purple-6">
              <div className="h-5 w-5 overflow-hidden me-3">
                <Image src={images.walletIcon} alt="" width={20} height={20} />
              </div>
              <Tooltip title={walletItem.walletAddress} placement="left">
                <div className="text-ellipsis overflow-hidden w-full">{walletItem.walletAddress}</div>
              </Tooltip>
            </li>
            <li className="flex items-center px-3 py-2 text-gray-500 hover:bg-purple-3 hover:text-purple-6">
              <div className="h-5 w-5 me-3 overflow-hidden">
                <Image src={images.ada} alt="" width={20} height={20} />
              </div>
              <Tooltip title={walletItem.walletBalance?.toString() + ' lovelace'} placement="left">
                <div className="overflow-hidden">{walletItem.walletBalance} ADA</div>
              </Tooltip>
            </li>
            <li className="border-t my-2"></li>
            <li className="flex items-center px-3 text-green-600 mb-3" onClick={refreshWallet}>
              <MdRefresh size="1.2em" className="me-3" />
              <div>Refresh</div>
            </li>
            <li className="flex items-center px-3 text-red-500" onClick={handleDisconnecWallet}>
              <MdLogout size="1.2em" className="me-3" />
              <div>Disconnect</div>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ConnectWallet;
