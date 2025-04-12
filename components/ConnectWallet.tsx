"use client"

import { useContext, useState } from "react"
import type { LucidContextType } from "@/types/LucidContextType"
import LucidContext from "@/contexts/components/LucidContext"
import wallets from "@/constants/wallet"
import Image from "next/image"
import images from "@/public/assets"
import type { WalletItemType } from "@/types/GenericsType"
import { FaCaretDown, FaCaretUp } from "react-icons/fa"
import { MdLogout, MdOutlineRemoveRedEye, MdRefresh } from "react-icons/md"
import { Tooltip } from "@mui/material"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"

const ConnectWallet = () => {
  const {
    isConnected,
    refreshWallet,
    connectWallet,
    disconnectWallet,
    walletItem,
    setWalletItem,
    loadingConnectWallet,
  } = useContext<LucidContextType>(LucidContext)
  const [activeWallet, setActiveWallet] = useState(false)
  const [isShowWallet, setIsShowWallet] = useState(false)
  const router = useRouter();
  const handleShowSellectWallet = () => {
    setActiveWallet(!activeWallet)
  }

  const handleShowInforWallet = () => {
    setIsShowWallet(!isShowWallet)
  }

  const handleConnectWallet = async (wallet: WalletItemType) => {
    try {
      setActiveWallet(false) // Ẩn danh sách ví khi chọn ví
      if (!(await wallet.walletCheckApi())) {
        setWalletItem((walletPrevious: WalletItemType) => ({
          ...walletPrevious,
          walletDownloadApi: wallet.walletDownloadApi,
          walletName: wallet.walletName,
          id: wallet.id,
        }))
      }

      // Kết nối ví
      await connectWallet({
        id: wallet.id,
        walletApi: wallet.walletApi,
        walletCheckApi: wallet.walletCheckApi,
        walletName: wallet.walletName,
        walletImage: wallet.walletImage,
      })

      const walletAddress = walletItem.walletAddress
      if (!walletAddress) throw new Error("Cannot read wallet address")

      toast.success("Connected wallet!", {
        position: "top-right",
      })
    } catch (error) {
      console.error(error)
      toast.error("Connected wallet failed!", {
        position: "top-right",
      })
    }
  }

  const handleDisconnecWallet = async () => {
    try {
      setIsShowWallet(false) // Ẩn thông tin ví khi ngắt kết nối
      await disconnectWallet()
      router.push("/");
    } catch (error) {
      console.error(error)
      toast.error("Disconnecting failed!", {
        position: "top-right",
      })
    }
  }

  return (
    <div className="relative z-30 ms-1.5">
      {isConnected === false ? (
        <div
          className="flex justify-between items-center rounded-full bg-blue-600 hover:bg-blue-700 px-4 py-1.5 text-white cursor-pointer transition-colors"
          onClick={handleShowSellectWallet}
        >
          Connect Wallet &nbsp; {activeWallet === true ? <FaCaretUp /> : <FaCaretDown />}
        </div>
      ) : (
        <div
          className="flex justify-between items-center rounded-full bg-indigo-900/30 px-4 py-1.5 border border-indigo-600/50 hover:bg-indigo-800/50 text-white cursor-pointer transition-colors backdrop-blur-sm"
          onClick={handleShowInforWallet}
        >
          <div className="flex items-center">
            {loadingConnectWallet === true ? (
              <span className="visually-hidden">Connecting...</span>
            ) : (
              <>
                <div className="h-5 w-5 overflow-hidden me-3">
                  <Image src={walletItem.walletImage || "/placeholder.svg"} alt="" width={20} height={20} />
                </div>
                <span>{walletItem.walletBalance}&nbsp;₳&nbsp;</span>
                {isShowWallet ? <FaCaretUp /> : <FaCaretDown />}
              </>
            )}
          </div>
        </div>
      )}

      {activeWallet === true && (
        <div className="absolute mt-4 right-0 bg-indigo-900/90 backdrop-blur-sm text-white w-40 rounded-md shadow-lg border border-indigo-600/30 overflow-hidden">
          <ul className="py-3">
            {wallets.slice(0, 5).map((wallet, index) => (
              <li
                className="flex items-center px-3 py-2 hover:bg-indigo-800/70 transition-colors cursor-pointer"
                key={index}
                onClick={() => handleConnectWallet(wallet)}
              >
                <div className="h-5 w-5 overflow-hidden me-3">
                  <Image src={wallet.walletImage || "/placeholder.svg"} alt="" width={20} height={20} />
                </div>
                <div id="user-name" className="text-gray-300">
                  {wallet.walletName}
                </div>
              </li>
            ))}
            <li className="border-t border-indigo-700/50 my-2"></li>
            <li className="flex items-center px-3 py-2 hover:bg-indigo-800/70 transition-colors cursor-pointer">
              <MdOutlineRemoveRedEye size="1.2em" className="me-3 text-indigo-300" />
              <div id="user-name" className="text-indigo-300">
                View All
              </div>
            </li>
          </ul>
        </div>
      )}

      {isShowWallet === true && (
        <div className="absolute mt-4 right-0 bg-indigo-900/90 backdrop-blur-sm text-white w-48 rounded-md shadow-lg border border-indigo-600/30 overflow-hidden">
          <ul className="py-3">
            <li className="flex items-center px-3 text-gray-300 py-2 hover:bg-indigo-800/70 transition-colors cursor-pointer" onClick={() => router.push('/user')}>
              <div className="h-5 w-5 overflow-hidden me-3">
                <Image src={images.walletIcon || "/placeholder.svg"} alt="" width={20} height={20} />
              </div>
              <Tooltip title={walletItem.walletAddress} placement="left">
                <div className="text-ellipsis overflow-hidden w-full">{walletItem.walletAddress}</div>
              </Tooltip>
            </li>
            <li className="flex items-center px-3 py-2 text-gray-300 hover:bg-indigo-800/70 transition-colors cursor-pointer">
              <div className="h-5 w-5 me-3 overflow-hidden">
                <Image src={images.ada || "/placeholder.svg"} alt="" width={20} height={20} />
              </div>
              <Tooltip title={walletItem.walletBalance?.toString() + " lovelace"} placement="left">
                <div className="overflow-hidden">{walletItem.walletBalance} ADA</div>
              </Tooltip>
            </li>
            <li className="border-t border-indigo-700/50 my-2"></li>
            <li
              className="flex items-center px-3 py-2 text-teal-400 hover:bg-indigo-800/70 transition-colors cursor-pointer"
              onClick={refreshWallet}
            >
              <MdRefresh size="1.2em" className="me-3" />
              <div>Refresh</div>
            </li>
            <li
              className="flex items-center px-3 py-2 text-red-400 hover:bg-indigo-800/70 transition-colors cursor-pointer"
              onClick={handleDisconnecWallet}
            >
              <MdLogout size="1.2em" className="me-3" />
              <div>Disconnect</div>
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default ConnectWallet

