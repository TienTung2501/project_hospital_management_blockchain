import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import React, { useContext } from 'react'
import { BsCopy } from 'react-icons/bs';
import nft from "~/assets/images/nft/user.png";
import './VotingCard.css'
import { AssetLock, AssetType } from '~/types/GenericsType';
import { LucidContextType } from '~/types/LucidContextType';
import LucidContext from '~/contexts/components/LucidContext';
import { SmartContractType } from '~/types/SmartContractType';
import SmartContractContext from '~/contexts/components/SmartContractContext';
import { getAllAsset } from '~/utils/fetchAssets/fetchAssetsFromAddress';
import { auctionAddress } from '~/libs';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import convertIpfsAddressToUrl from '~/helper/convertIpfsAddressToUrl ';
import { handleLoading } from '~/utils/store/features/uiSlice';
import { useAppDispatch, useAppSelector } from '~/utils/store/store';

import mintAsset from "~/apiServices/contract/mintAsset";
import { NFTMintInfor } from '~/utils';
import { handleRefeshWallet } from '~/utils/store/features/walletSlice';
import listAssetsLock from '~/apiServices/contract/listAssetsLock';
import { DatumLock } from '~/constants/datumlock';
import { getBech32FromAddress } from '~/constants/utils';
interface NFTModalProps {
  isAppear: boolean;
  setAppear: (isAppear: boolean) => void;
  nft: AssetLock;
}
function convertMetadataToObj(metadataArray: any) {
  const resultObj: any = {};
  for (const item of metadataArray) {
    if (item.hasOwnProperty("property") && item.hasOwnProperty("value")) {
      resultObj[item.property] = item.value;
    }
  }
  return resultObj;
}
export default function VotingCard(props: NFTModalProps) {
  let { nft, isAppear, setAppear } = props;
  const { lucidWallet, walletItem, isConnected } = useContext<LucidContextType>(LucidContext);
  const { startTimeVote, endTimeVote, setVotingOnGoing, setLockingOnGoing, lockBid, vote, assetsLockFromSmartContract } = useContext<SmartContractType>(SmartContractContext);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const refeshWallet = useAppSelector((state) => state.wallet.refeshWallet);


  const handleVote = async () => {
    setAppear(false);
    if (lucidWallet && isConnected) {
      setVotingOnGoing(true);
      dispatch(handleLoading({ loading: true }));
      const voterAddr = await lucidWallet.wallet.address();
      const listAssetLock :DatumLock[]=await listAssetsLock();
      let findAsset=false;
      for(var i=0;i<listAssetLock.length;i++){
        if(voterAddr===getBech32FromAddress(lucidWallet,listAssetLock[i].bidderAddress)){
          findAsset=true;
        }
      }
      if(findAsset===true){
        toast.error("You cant not vote for yourself NFT you register for bid");
      }
      else{
        if (nft && nft.assetName) {
          const lock_until: bigint = BigInt(endTimeVote) - BigInt(1800);
          const assetFromAddress: AssetType[] = await getAllAsset(voterAddr);
          console.log(assetFromAddress);
  
          const assetWithName = assetFromAddress.find(asset => asset.asset_name === nft.assetNameHex);
          if (!assetWithName) {
            //Minting NFT
            try {
              const nftMintInfor: NFTMintInfor = {
                fileURL: "",
                title: nft.assetName,
                mediaType: "mediaType",
                desc: `voting ticket for ${nft.assetName}`,
                metadata: []
              }
              const customMetadata = convertMetadataToObj(nftMintInfor.metadata);
              const { txHash, policyId, assetName } = await mintAsset({
                lucid: lucidWallet,
                customMetadata,
                description: nftMintInfor.desc ? nftMintInfor.desc : "",
                imageUrl: nft.image ? nft.image : "null",
                mediaType: "",
                title: nftMintInfor.title ? nftMintInfor.title : ""
              });
  
              if (!txHash) {
                throw new Error("Minting asset failed");
              }
              //dispatch(handleRefeshWallet({ refeshWallet: !refeshWallet }));
              toast.success("Minted a same asset successfully!");
  
            }
            catch (error: any) {
              console.log(error)
              if (error.message) {
                toast.error(error.message);
              }
              else {
                toast.error("Voting interupted!");
              }
              dispatch(handleLoading({ loading: false }));
              return;
            }
          }
  
          //Voting
          //const updatedAssetFromAddress: AssetType[] = await getAllAsset(voterAddr);
          var assetNameCompare = null;
  
          for (let i = 0; i < 10; i++) {
            const updatedAssetFromAddress: AssetType[] = await getAllAsset(voterAddr);
            assetNameCompare = updatedAssetFromAddress.find(asset => asset.asset_name === nft.assetNameHex);
            console.log("updatedAssetFromAddress:" + i.toString(), updatedAssetFromAddress);
            console.log("nft:", nft);
            if (assetNameCompare) {
              break;
            }
            // Chờ một khoảng thời gian trước khi gọi lại lệnh
            //await new Promise(resolve => setTimeout(resolve, 1000)); // Chờ 1 giây trước khi gọi lại lệnh
          }
  
          if (!assetNameCompare || assetNameCompare == null) {
            //dispatch(handleRefeshWallet({ refeshWallet: !refeshWallet }));
            dispatch(handleLoading({ loading: false }));
            toast.error("Minted NFT for voting was not found!");
            return;
          }
  
  
          const policyId = assetNameCompare?.policy_id!;
          try {
            var txHash = null;
            for (let i = 0; i < 10; i++) {
              txHash = await vote({
                lucid: lucidWallet,
                policyId,
                assetName: nft.assetNameHex!,
                lock_until,
                voterAddress: voterAddr,
                auctionAddress: auctionAddress
              });
              if (txHash) {
                break;
              }
  
            }
  
            if (!txHash || txHash == null) {
              throw new Error("Voted asset failed!");
            }
            toast.success("Voted asset successfully!");
            setVotingOnGoing(false);
            //return navigate(`/Bidding`);
  
          } catch (error: any) {
            if (error.message) {
              toast.error(error.message);
            }
            else {
              toast.error("An error occurred while voting the NFT");
            }
          }
          finally {
            dispatch(handleRefeshWallet({ refeshWallet: !refeshWallet }));
            dispatch(handleLoading({ loading: false }));
          }
        }
        else {
          toast.error("AssetName And policyId undefined");
        }
        dispatch(handleLoading({ loading: false }));
      }
    }
    else {
      toast.error("Please connect wallet before Voting");
    }
  }
  return (
    <Dialog
      fullWidth={true}
      maxWidth={"xs"}
      open={isAppear}
      onClose={() => setAppear(false)}
      className=''>
      {/* <DialogTitle>Optional sizes</DialogTitle> */}
      <DialogContent className=' text-white'>
        <div className='relative overflow-hidden rounded-xl h-52  bg-fog-1 mb-5'>
          <img src={nft.image ? convertIpfsAddressToUrl(nft.image) || '' : ''} alt={nft.image || ''} className='object-contain w-full h-full' />
          <div className='font-semibold absolute left-3 top-3 drop-shadow-2xl' id="voteNumber">{nft.voteAmount} Votes</div>
        </div>
        <div className='grid grid-cols-3 gap-1'>
          <div className='w-36 font-semibold'>Asset Name</div>
          <div className='flex items-center col-span-2'>
            <BsCopy className='w-4 h-4' />
            &ensp;
            <div className='w-full'>{nft.assetName}</div>
          </div>
          <div className='w-36 font-semibold me-2'>Policy ID</div>
          <div className='flex items-center break-all col-span-2'>
            <BsCopy className='w-4 h-4' />
            &ensp;
            <div className='w-full'>{nft.policyId}</div >
          </div>
          <div className='w-36 font-semibold'>Author</div>
          <div className='flex items-center break-all col-span-2'>
            <BsCopy className='w-4 h-4' />
            &ensp;
            <div className='w-full'>{nft.assetNameHex}</div>
          </div>
        </div>
        <div className='mt-3 italic text-fog-2'>
          *When a vote is confirmed, an NFT with similar content will be minted as a record of the vote on the blockchain system.
        </div>
      </DialogContent>
      <DialogActions className='flex justify-between bg-fog-2 text-white'>
        <button className="rounded-lg bg-green-400 py-1.5 px-6 border
                transition ease-in-out delay-150 hover:scale-110  border-white hover:bg-green-500" onClick={handleVote}>Confirm Voting</button>
        <button className="rounded-lg bg-gray-500 py-1.5 px-6 border border-fog-2
                transition ease-in-out delay-150 hover:scale-110  border-white hover:bg-fog-3" onClick={() => setAppear(false)}>Cancel</button>
      </DialogActions>

    </Dialog>
  )
}
