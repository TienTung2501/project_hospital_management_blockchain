import configs from "@/configs";
import images from "@/public/assets";
import { WalletItemType } from "@/types/GenericsType";

declare const window: any;

const wallets: Array<WalletItemType> = [
    {
        id:1,
        walletName: "Lace",
        walletImage: images.namiWallet,
        walletApi: async function () {
            return await window.cardano.lace.enable();
        },
        walletCheckApi: async function () {
            return await window.cardano.lace;
        },
        walletDownloadApi: configs.wallets.lace,
    },
    {
        id:2,
        walletName: "Eternl",
        walletImage: images.eternlWallet,
        walletApi: async function () {
            return window.cardano.eternl.enable();
        },
        walletCheckApi: async function () {
            return await window.cardano.eternl;
        },
        walletDownloadApi: configs.wallets.eternl,
    },
    {
        id:3,
        walletName: "Flint",
        walletImage: images.flintWallet,
        walletApi: async function () {
            return await window.cardano.flint.enable();
        },
        walletCheckApi: async function () {
            return await window.cardano.flint;
        },
        walletDownloadApi: configs.wallets.flint,
    },
    {
        id:4,
        walletName: "Gero",
        walletImage: images.geroWallet,
        walletApi: async function () {
            return await window.cardano.gero.enable();
        },
        walletCheckApi: async function () {
            return await window.cardano.gero;
        },
        walletDownloadApi: configs.wallets.gero,
    },
    {
        id:5,
        walletName: "Typhon",
        walletImage: images.typhonWallet,
        walletApi: async function () {
            return await window.cardano.typhon.enable();
        },
        walletCheckApi: async function () {
            return await window.cardano.typhon;
        },
        walletDownloadApi: configs.wallets.typhon,
    },
    {
        id:6,
        walletName: "Vespr",
        walletImage: images.vesprWallet,
        walletApi: async function () {
            return await window.cardano.vespr.enable();
        },
        walletCheckApi: async function () {
            return await window.cardano.vespr;
        },
        walletDownloadApi: configs.wallets.vespr,
    },
];

export default wallets;
