import React, { Fragment, useContext, useState } from 'react'
import { FaRegHeart } from "react-icons/fa";
import { Link } from 'react-router-dom';
import nftImg from "~/assets/images/nft/nft4.png";
import NFTModal from '../NFTModal';
import { useNavigate } from 'react-router-dom';
import convertIpfsAddressToUrl from '~/helper/convertIpfsAddressToUrl ';
import LucidContext from '~/contexts/components/LucidContext';
import { LucidContextType } from '~/types/LucidContextType';
import { auctionAddress } from '~/libs';
import { toast } from 'react-toastify';
import CountdownTimer from '../CountdownTimer';
import { SmartContractType } from '~/types/SmartContractType';
import SmartContractContext from '~/contexts/components/SmartContractContext';
import { AssetType } from '~/types/GenericsType';
import { getAllAsset } from '~/utils/fetchAssets/fetchAssetsFromAddress';
import bid from '~/apiServices/contract/bid';
import { useAppDispatch, useAppSelector } from '~/utils/store/store';
import { handleLoading } from '~/utils/store/features/uiSlice';
import { handleRefeshWallet } from '~/utils/store/features/walletSlice';


type NFTProps = {
  policyId?: string;
  assetName?: string;
  imgSrc?: string;
  width?: number;
  className?: string;
  name?: string;
  link?: string;
  description?: string;
  bidder?: string;
  auction?: string;
  author?: string;
  amountConstrain?: bigint;
  mediaType?: string;
  voteAmount?: number;
  onBidding?: boolean;
  priceBidding?: bigint;
  onVoting?: boolean;
  onLocking?: boolean;
  isMyAsset?: boolean;
  likes?:number;
  fixed?:boolean;
}


export default function NFT(props: NFTProps) {
  let {fixed=false,likes =300, isMyAsset, policyId, assetName, imgSrc, width, className, name, link, onBidding, voteAmount,  priceBidding } = props;
  const [activePreview, setActivePreview] = useState<boolean>(false);
  const { lucidWallet, walletItem, isConnected } = useContext<LucidContextType>(LucidContext);
  const { startTimeVote, endTimeVote, setVotingOnGoing, setLockingOnGoing, lockBid, vote, assetsLockFromSmartContract } = useContext<SmartContractType>(SmartContractContext);
  const isConnectWallet = useAppSelector((state: { ui: { isConnectWallet: any; }; }) => state.ui.isConnectWallet);
  const refeshWallet = useAppSelector((state) => state.wallet.refeshWallet);
  const refeshStoreVoting = useAppSelector((state) => state.nft.refeshStoreVoting);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLockNFT = async () => {

    const bidderAddress: any = walletItem.walletAddress;
    console.log(`Asset Name:${assetName} Policy:${policyId}`)
    if (lucidWallet && isConnectWallet) {
      if (policyId && assetName) {
        setLockingOnGoing(true);
        const assetWithName = assetsLockFromSmartContract.find(asset => asset.assetNameHex === assetName);
        if (assetWithName) {
          toast.error("NFT was already requested, please choose another NFT or wait for next Auction!");
        }
        else {
          try {
            dispatch(handleLoading({ loading: true }));
            const { txHash } = await lockBid({
              lucid: lucidWallet,
              policyId,
              assetName
            });
            if (!txHash) {
              throw new Error("Upload asset to platform failed!");
            }
            toast.success("Uploaded asset to platform successfully!");
            setLockingOnGoing(false);
            return navigate(`/Voting`);
            
          } catch (error: any) {
            console.error("An error occurred while locking the NFT:", error);
            if (error.message) {
              toast.error(error.message);
            }
            else {
              toast.error("An error occurred while requesting the NFT");
            }
          }
          finally {
            dispatch(handleRefeshWallet({refeshWallet:!refeshWallet}));
            dispatch(handleLoading({ loading: false }));
          }
        }

      } else {
        toast.error("PolicyId or AssetName is undefined");
       }
    }

  }

  return (
    <Fragment>
      <NFTModal isAppear={activePreview} setAppear={setActivePreview} />
      <div className={`rounded-[20px] border p-3.5 bg-fog-1 ${className}`}>
        <div className={`h-72 w-30 nft-image rounded-[20px] relative overflow-hidden `}
          onClick={() => { !onBidding ? setActivePreview(true) : navigate(`/Bidding/${policyId&&assetName?(policyId+assetName):undefined}`) }}>
          <img
            src={fixed==false?(imgSrc ? convertIpfsAddressToUrl(imgSrc) || '' : ''):imgSrc}
            alt={imgSrc || ''}
            className="w-full h-full object-cover object-center relative"
          />
          {onBidding && <div className="absolute inset-0 top-3 left-3 ntf-vote font-semibold">
            {voteAmount} Votes
          </div>}

        </div>

        <div className="nft-pre-infor flex justify-between my-2">
          <div className="nft-name font-semibold">{name}</div>
          <div className="nft-like flex items-center ">
            <FaRegHeart color="red" />
            &nbsp;{likes}
          </div>
        </div>
        {onBidding && <div className="nft-desc text-fog-2  my-2 overflow-hidden text-ellipsis">PolicyId:&nbsp;{policyId}</div>}
        {onBidding && <div className="nft-more-infor font-semibold flex justify-between  my-2">
          <div className="bidding-time ">
            <CountdownTimer startTimeVote={startTimeVote} endTimeVote={endTimeVote} />
          </div>
          <div className="nft-ada">{Number(priceBidding)} ADA</div>
        </div>}
        {isMyAsset == true &&
          <button className="rounded-[10px] bg-fog-1 px-3 py-1 border border-fog-2 
              transition ease-in-out delay-150  hover:scale-105 hover:text-green-500  hover:border-green-500"
            onClick={handleLockNFT}>
            Request to Bid
          </button>
        }
        {(!onBidding&&isConnectWallet && isMyAsset == false) &&
          <button className="rounded-[10px] bg-fog-1 px-3 py-1 border border-fog-2 
              transition ease-in-out delay-150  hover:scale-105 hover:text-green-500  hover:border-green-500"
          >
            Like
          </button>
        }

      
      </div>
    </Fragment>

  )
}
