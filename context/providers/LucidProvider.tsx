"use client";
import React, { ReactNode, useEffect, useState } from "react";
import { Blockfrost, Lucid } from "lucid-cardano";
import LucidContext from "@/context/components/LucidContext";
import { WalletItemType } from "@/type/GenericsType";

import { connectLucid } from "@/service/cardano/lucid";
import wallets from "@/constant/wallet";


type Props = { children: ReactNode };

export const LucidProvider = function ({ children }: Props) {
    const [networkPlatform, setNetworkPlatform] = useState<string>("Preview");
    const [loadingConnectWallet, setLoadingConnectWallet] = useState<boolean>(false);
    const [lucidNeworkPlatform, setLucidNeworkPlatform] = useState<Lucid>(null!);
    const [isConnected, setIsConnected] = useState<boolean>(false);

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
                const lucidInstance = await connectLucid();
                //console.log(lucidInstance)
                //dispatch(handleChangeLucid({lucid: lucidInstance}));
                setLucidNeworkPlatform(lucidInstance);
                setLucidWallet(lucidInstance);
            } catch (error) {

                console.error('Cannot connect to Lucid API:', error);
            } finally {
    
            }
        };
        fetchLucid();

    }, [networkPlatform]);

    // useEffect(() => {
    //     setLucidWallet(lucidNeworkPlatform);
    //     // react-hooks/exhaustive-deps
    // }, [lucidNeworkPlatform, networkPlatform]);

    const refreshWallet = async () => {
        try {
            setLoadingConnectWallet(true);
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
            console.log(updateWalletItem);
            setLucidWallet(lucid);
            setLucidNeworkPlatform(lucid);
        } catch (error: any) {
            console.log(error);
            throw Error(error.message)
        } finally {
            setLoadingConnectWallet(false);
        }

    }

    const connectWallet = async function ({ id, walletApi, walletName, walletImage, walletCheckApi }: WalletItemType) {
        try {
            setLoadingConnectWallet(true);
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
            console.log(walletItem);
            setLucidWallet(lucid);
            setLucidNeworkPlatform(lucid);
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingConnectWallet(false);
        }
    };

    const disconnectWallet = async function () {
        try {
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
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <LucidContext.Provider
            value={{
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
                isConnected,
            }}
        >
            {children}
        </LucidContext.Provider>
    );
};
