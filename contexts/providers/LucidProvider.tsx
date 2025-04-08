"use client";
import React, { ReactNode, useEffect, useState } from "react";
import { Blockfrost, Lucid } from "lucid-cardano";
import LucidContext from "@/contexts/components/LucidContext";
import { WalletItemType } from "@/types/GenericsType";

import { connectLucid } from "@/services/cardano/lucid";
import wallets from "@/constants/wallet";
import { toast } from "react-toastify";

// Cài đặt spinner (ví dụ: sử dụng Tailwind CSS)
const Spinner = () => (
    <div className="flex justify-center items-center space-x-2">
      <div className="w-8 h-8 border-4 border-t-4 border-gray-200 rounded-full animate-spin border-t-blue-500"></div>
    </div>
  );
type Props = { children: ReactNode };

export const LucidProvider = function ({ children }: Props) {
    const [networkPlatform, setNetworkPlatform] = useState<string>("Preview");
    const [loadingConnectWallet, setLoadingConnectWallet] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [lucidNeworkPlatform, setLucidNeworkPlatform] = useState<Lucid>(null!);
    const [isConnected, setIsConnected] = useState<boolean>(false);
const [dateOfDocument, setDateOfDocument] = useState(""); // New state for date
    const [lucidWallet, setLucidWallet] = useState<Lucid>(null!);

    const [walletItem, setWalletItem] = useState<WalletItemType>({
        id: 0,
        walletDownloadApi: "",
        walletBalance: 0,
        walletAddress: "",
        walletName: "",
        walletImage: "",
        walletCheckApi: async function () { },
        walletApi: async function () { },
    });

    useEffect(() => {
        const fetchLucid = async () => {
            try {
                setIsLoading(true);  // Bật spinner khi bắt đầu tải trang
                const lucidInstance = await connectLucid();
                //console.log(lucidInstance)
                //dispatch(handleChangeLucid({lucid: lucidInstance}));
                setLucidNeworkPlatform(lucidInstance);
                setLucidWallet(lucidInstance);
                setIsLoading(false);
            } catch (error) {
                console.error('Cannot connect to Lucid API:', error);
            } finally {
                setIsLoading(false)
            }
        };
        fetchLucid();

    }, [networkPlatform]);

    // useEffect(() => {
    //     setLucidWallet(lucidNeworkPlatform);
    //     // react-hooks/exhaustive-deps
    // }, [lucidNeworkPlatform, networkPlatform]);
    // trong component
useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsLoading(false);
      }
    };
  
    window.addEventListener("keydown", handleKeyDown);
  
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

    const refreshWallet = async () => {
        try {
            setIsLoading(true);  // Bật spinner khi bắt đầu tải trang
            setIsConnected(true);
            let lucid: Lucid = await connectLucid();
            console.log(walletItem);
            const selectedWallet:WalletItemType|undefined= wallets.find(x => x.id == walletItem.id);
            if (!selectedWallet) throw Error("Cannot reconnect to wallet")
            const selectedWalletAPI = await selectedWallet.walletApi();
            lucid.selectWallet(selectedWalletAPI);
            let walletAddress = await lucid.wallet.address();
            console.log(walletAddress);
            const utxos = await lucid.wallet.getUtxos();
            const walletBalance =
                Number(
                    utxos.reduce(function (balance, utxo) {
                        return balance + utxo.assets.lovelace;
                    }, BigInt(0)),
                ) / 1000000;

            const updateWalletItem = walletItem;
            updateWalletItem.walletAddress = walletAddress;
            updateWalletItem.walletBalance = walletBalance;
            updateWalletItem.walletName = walletItem.walletName;
            updateWalletItem.walletImage = walletItem.walletImage;
            setWalletItem(updateWalletItem);
            setLucidWallet(lucid);
            setLucidNeworkPlatform(lucid);
            toast.success("RefreshWallet successfully")
        } catch (error: any) {
            console.log(error);
            throw Error(error.message)
        } finally {
            setIsLoading(false);  // Bật spinner khi bắt đầu tải trang
        }

    }

    const connectWallet = async function ({ id, walletApi, walletName, walletImage, walletCheckApi }: WalletItemType) {
        try {
            setIsLoading(true);  // Bật spinner khi bắt đầu tải trang
            setIsConnected(true);
            let lucid: Lucid = lucidNeworkPlatform;

            lucid.selectWallet(await walletApi());
            let walletAddress = await lucid.wallet.address();
            console.log(walletAddress);
            const utxos = await lucid.wallet.getUtxos();
            const walletBalance =
                Number(
                    utxos.reduce(function (balance, utxo) {
                        return balance + utxo.assets.lovelace;
                    }, BigInt(0)),
                ) / 1000000;
            walletItem.id = id;
            walletItem.walletAddress = walletAddress;
            walletItem.walletBalance = walletBalance;
            walletItem.walletName = walletName;
            walletItem.walletImage = walletImage;
            setWalletItem(walletItem);
            setLucidWallet(lucid);
            setLucidNeworkPlatform(lucid);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);  // Bật spinner khi bắt đầu tải trang 
        }
    };

    const disconnectWallet = async function () {
        try {
            setIsLoading(true);  // Bật spinner khi bắt đầu tải trang
            setIsConnected(false);
            setWalletItem({
                walletDownloadApi: "",
                walletBalance: 0,
                walletAddress: "",
                walletName: "",
                walletImage: "",
                walletCheckApi: async function () { },
                walletApi: async function () { },
            });

            let lucid: Lucid = lucidNeworkPlatform;
            lucid.selectWallet(null!);
            setLucidWallet(lucid);
            toast.success("Disconnect successfully")
            setIsLoading(false);  // Bật spinner khi bắt đầu tải trang
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <LucidContext.Provider
            value={{
                isLoading,
                refreshWallet,
                networkPlatform,
                disconnectWallet,
                connectWallet,
                lucidWallet,
                walletItem,
                lucidNeworkPlatform,
                setWalletItem,
                setLucidNeworkPlatform,
                setNetworkPlatform,
                loadingConnectWallet,
                setIsLoading,
                isConnected,
            }}
        >
                   {isLoading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              animation: "spin 1s linear infinite",
            }}
          >
            <Spinner />
          </div>
        </div>
      )}

            {children}
        </LucidContext.Provider>
    );
};
