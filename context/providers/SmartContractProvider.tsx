'use client';
import React, { ReactNode, useCallback, useContext, useEffect, useState } from "react";
import SmartContractContext from "@/context/components/SmartContractContext";

import burnAsset from "@/service/cardano/burnAsset";
import mintAsset from "@/service/cardano/mintAsset";


// import { fetchAssetInformationFromUnit } from "@/utils/fetchAssets/fetchAssetsFromAddress";
import { AssetBidType, AssetLock, AssetType, InforAssetVoteType } from "@/type/GenericsType";
import LucidContext from "../components/LucidContext";
import { LucidContextType } from "@/type/LucidContextType";

// import { filterAssetNftOnBing, filterDatumFromPolicyId } from "@/helper/findUtxoOnSmartContract";
import readValidator from "@/helper/readValidator";
import { Script } from "lucid-cardano";
import { getBech32FromAddress } from "@/helper/utils";

type Props = {
    children: ReactNode;
};

const SmartContractProvider = function ({ children }: Props) {
    const {networkPlatform, lucidNeworkPlatform,lucidWallet } = useContext<LucidContextType>(LucidContext);
//     const [assetsLockFromSmartContract, setAssetsLockFromSmartContract] = useState<AssetLock[]>([]);
//     const [assetsBidFromSmartContract, setAssetsBidFromSmartContract] = useState<AssetBidType[]>([]);
//     const [assetsVoteFromSmartContract, setAssetsVoteFromSmartContract] = useState<AssetType[]>([]);
//     const [loadingAssetsFromSmartContract, setLoadingAssetsFromSmartContract] = useState<boolean>(true);
//     const [votingOngoing,setVotingOnGoing]=useState<boolean>(true);
//     const [lockingOnGoing,setLockingOnGoing]=useState<boolean>(true);
//     const [startTimeVote, setStartTimeVote] = useState<number>((new Date('March 18, 2024 04:35:57').getTime()));
//     const [endTimeVote, setEndTimeVote] = useState<number>((new Date('March 18, 2024 04:59:57').getTime()));
//     const [biddingOnGoing,setBiddingOnGoing]=useState<boolean>(true);
//    // const [startTimeVote, setStartTimeVote] = useState<number>((new Date('March 16, 2024 13:01:57').getTime()));
// //    const [startTimeVote, setStartTimeVote] = useState<number>((new Date('March 16, 2024 17:40:57').getTime()));
// //    const [endTimeVote, setEndTimeVote] = useState<number>((new Date('March 16, 2024 18:01:57').getTime()));
//     const [inforAssetVotes,setInforAssetVote]=useState<InforAssetVoteType[]>([]);
//     const [topAssetVote,setTopAssetVote]=useState<string[]>([]);
//     const timetoUnlock=new Date('March 16, 2024 18:01:57').getTime();
//     useEffect(() => {
//         const currentTime = new Date().getTime();
//         if (currentTime >= endTimeVote) {
//             // Sắp xếp inforAssetVotes theo voteAmount giảm dần
//             const sortedVotes = [...inforAssetVotes].sort((a, b) => b.voteAmount! - a.voteAmount!);
//             // Lấy ra top 5 assetName
//             const top5AssetNames: string[] = [];
//             sortedVotes.some((vote) => {
//                 if (vote.assetName) {
//                     top5AssetNames.push(vote.assetName);
//                     return top5AssetNames.length === 5;
//                 }
//                 return false;
//             });
//             // Lưu top 5 assetName vào state topAssetVote
//             setTopAssetVote(top5AssetNames);
//         }
//     }, [votingOngoing, inforAssetVotes]);
    
//     const fetchInforAssetVotesFromSmartContract = async () => {
//         try {
//             const assets = await listAssetsVote();
//             if (assets) {
//                 const assetPromises: Promise<AssetType>[] = assets.map(async (asset) => {
//                     const unit: string = asset.policyId! + asset.assetName!;
//                     const response: AssetType = await fetchAssetInformationFromUnit(unit);
//                     // Ép kiểu thêm URL cho asset
//                     return response;
//                 });
//                 const resolvedAssets = await Promise.all(assetPromises);
    
//                 // Tạo một mảng mới để lưu trữ thông tin vote của asset
//                 const newInforAssetVotes: InforAssetVoteType[] = [];
    
//                 // Duyệt qua tất cả các asset đã giải quyết
//                 resolvedAssets.forEach((asset) => {
//                     // Tìm xem asset đã tồn tại trong mảng newInforAssetVotes chưa
//                     const existingAssetIndex = newInforAssetVotes.findIndex(
//                         (item) => item.assetName === asset.asset_name
//                     );
//                     if (existingAssetIndex !== -1) {
//                         // Nếu asset đã tồn tại, tăng voteAmount của nó lên 1
//                         newInforAssetVotes[existingAssetIndex].voteAmount! += 1;
//                     } else {
//                         // Nếu asset chưa tồn tại, thêm nó vào mảng mới với voteAmount là 1
//                         newInforAssetVotes.push({ assetName: asset.asset_name, voteAmount: 1 });
//                     }
//                 });
//                 // Cập nhật lại state của inforAssetVotes bằng mảng mới
//                 //console.log("newInforAssetVotes",newInforAssetVotes)
//                 setInforAssetVote(newInforAssetVotes);
//                 return newInforAssetVotes;
//             }
//         } catch (error) {
//             console.error(error);
//             return inforAssetVotes;
//         }
//     };

//     const getTop5NFTHighestVoting = async () =>{
//         const currentTime = new Date().getTime();
//         if (currentTime >= endTimeVote) {
//             try {
//                 const updateVotes = await fetchInforAssetVotesFromSmartContract();
//                 if(!updateVotes){
//                     throw Error("List Voting NFTs is empty!")
//                 }
//                 const sortedVotes = [...updateVotes].sort((a, b) => b.voteAmount! - a.voteAmount!);
//                 // Lấy ra top 5 assetName
//                 const top5AssetNames: string[] = [];
//                 sortedVotes.some((vote) => {
//                     if (vote.assetName) {
//                         top5AssetNames.push(vote.assetName);
//                         return top5AssetNames.length === 5;
//                     }
//                     return false;
//                 });
//                 // Lưu top 5 assetName vào state topAssetVote
//                 return top5AssetNames;
//             } catch (error) {
//                 console.log(error);
//                 return null;
//             }
           
//         }
//         return null;
//     }

//     const fetchAssetsBidFromSmartContract = async ()=>{
//         try {
//             const updateVotes = await fetchInforAssetVotesFromSmartContract();
//             const toTalAssetsOnBid = await listAssetsBid();
//             const assets= filterAssetNftOnBing(toTalAssetsOnBid);
//             console.log(`number asset on bid:${toTalAssetsOnBid.length}`)
//             if (assets) {
//                 const assetPromises: Promise<AssetBidType>[] = assets.reverse().map(async function (asset:DatumBid) {
//                     const unit: string = asset.policyId! + asset.assetName!;
//                     const response: AssetType = await fetchAssetInformationFromUnit(unit);
//                     const policy_id = response.policy_id;
//                     const asset_name = response.asset_name;
//                     const bidderAddr=getBech32FromAddress(lucidWallet,asset.bidderAddress);
//                     const authorAddr=getBech32FromAddress(lucidWallet,asset.authorAddress);
//                     const winnerAddr=getBech32FromAddress(lucidWallet,asset.winnerAddress);
//                     const amountConstrain=100;
//                     const image = response.onchain_metadata?.image;
//                     const description=response.onchain_metadata?.description;
//                     const mediaType=response.onchain_metadata?.mediaType;
//                     const title=response.onchain_metadata?.name;
//                     const fingerprint=response.fingerprint;
//                     const datumUtxoMoney=filterDatumFromPolicyId(toTalAssetsOnBid,policy_id!);
//                     let price:bigint;
//                     if(datumUtxoMoney.length>0){
//                         price=datumUtxoMoney[0].price
//                     }
//                     else{
//                         price=BigInt(0);
//                     }
//                     price=(price)/BigInt(1000000);
//                     console.log(`
//                     policyId:${policy_id}
//                     price on bid:${price}`)
//                     const quantity=response.quantity;
//                     const voteAmount = findVoteAmount(asset.assetName!, updateVotes!); // Sử dụng giá trị mới của inforAssetVotes
//                     return {asset_name, policy_id, image, description, bidderAddr, winnerAddr,authorAddr,amountConstrain,mediaType,title,fingerprint,priceBidding:price,quantity,voteAmount};
//                 });
//                 const resolvedAssets = await Promise.all(assetPromises);
//                 return resolvedAssets;
//                 setAssetsBidFromSmartContract(resolvedAssets);
//                 setLoadingAssetsFromSmartContract(false);
//             }
//         } catch (error) {
//             console.error(error);
//         }
//     }
//     const fetchAssetsLockFromSmartContract = async function () {
//         try {
//             const updateVotes = await fetchInforAssetVotesFromSmartContract();
//             const assets = await listAssetsLock();
//             if (assets) {
//                 const assetPromises: Promise<AssetLock>[] = assets.reverse().map(async function (asset) {
//                     const unit: string = asset.policyId! + asset.assetName!;
//                     const response: AssetType = await fetchAssetInformationFromUnit(unit);
//                     const assetName = response.onchain_metadata?.name;
//                     const policyId = response.policy_id;
//                     const image = response.onchain_metadata?.image;
//                     const assetNameHex = response.asset_name;
//                     const bidderAddr =getBech32FromAddress(lucidWallet,asset.bidderAddress);
//                     const auctionAddr =getBech32FromAddress(lucidWallet,asset.auctionAddress);
//                     const voteAmount = findVoteAmount(assetNameHex!, updateVotes!); // Sử dụng giá trị mới của inforAssetVotes
//                     return { assetNameHex, assetName, policyId, image, voteAmount, bidderAddr, auctionAddr };
//                 });
//                 const resolvedAssets = await Promise.all(assetPromises);
//                 return resolvedAssets;
//                 setAssetsLockFromSmartContract(resolvedAssets);
//                 setLoadingAssetsFromSmartContract(false);
//             }
//         } catch (error) {
//             console.error(error);
//         }
//     };
    
//     const findVoteAmount = (assetName: string, inforAssetVotes: InforAssetVoteType[]): number => {
//         const assetVote = inforAssetVotes.find(item => item.assetName === assetName);
//         if (assetVote) {
//             return assetVote.voteAmount ?? 0;
//         }
//         return 0;
//     };
//     const resetVote=()=>{
//         setTopAssetVote([]);
//         setInforAssetVote([]);
//         setLockingOnGoing(false);
//     }
//     useEffect(()=>{
//         resetVote();
//     },[biddingOnGoing])

    // useEffect(
    //     function () {    
    //         fetchAssetsLockFromSmartContract();
    //     },
    //     [networkPlatform, lucidNeworkPlatform,lockingOnGoing],
    // );

    // useEffect(()=>{
    //     fetchInforAssetVotesFromSmartContract();
    // },[networkPlatform,lucidNeworkPlatform,votingOngoing]);
    return (
        <SmartContractContext.Provider
            value={{
                // fetchAssetsBidFromSmartContract,
                // getTop5NFTHighestVoting,
                // fetchAssetsLockFromSmartContract,
                // lockingOnGoing,
                // startTimeVote,
                // endTimeVote,
                // setStartTimeVote,
                // setEndTimeVote,
                // inforAssetVotes,
                // topAssetVote,
                // assetsLockFromSmartContract,
                // assetsBidFromSmartContract,
                // assetsVoteFromSmartContract,
                // setInforAssetVote,
                // setAssetsLockFromSmartContract,
                // setAssetsBidFromSmartContract,
                // setAssetsVoteFromSmartContract,
                // loadingAssetsFromSmartContract,
                // setLoadingAssetsFromSmartContract,
                // votingOngoing,
                // biddingOnGoing,
                // setBiddingOnGoing,
                // setVotingOnGoing,
                // setLockingOnGoing,
                // setTopAssetVote,
                burnAsset,
                mintAsset,
                // lockBid,
                // unLock,
                // vote,
                // bid,
            }}
        >
            {children}
        </SmartContractContext.Provider>
    );
};

export default SmartContractProvider;
