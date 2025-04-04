import React, { Fragment, useContext, useState } from "react";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import { LuVote } from "react-icons/lu";

import nftImg from "~/assets/images/nft/nft4.png";
import VotingCard from "../VotingCard";
import { toast } from "react-toastify";
import { SmartContractType } from "~/types/SmartContractType";
import SmartContractContext from "~/contexts/components/SmartContractContext";
import { LucidContextType } from "~/types/LucidContextType";
import LucidContext from "~/contexts/components/LucidContext";
import { NFTVoteInfor } from "~/utils";
import { AssetLock, AssetType } from "~/types/GenericsType";
import { getAllAsset } from "~/utils/fetchAssets/fetchAssetsFromAddress";

import { auctionAddress } from '~/libs';
import { useNavigate } from "react-router-dom";
import convertIpfsAddressToUrl from "~/helper/convertIpfsAddressToUrl ";
interface PropsVoting {
  className?: string;
  isInCart?: Boolean;
  nft:AssetLock;
  no?:number;
}
export default function NFTOnVoting(props: PropsVoting) {
  let {no = 0, nft, className, isInCart = false } = props;
  const [showCard, setShowCard] = useState<boolean>(false);
 
  return (
    <Fragment>
      <VotingCard isAppear={showCard} setAppear={setShowCard} nft={nft}/>
      <div
        className={`flex justify-between items-center cursor-pointer ${className}`}
      >
        <div id="voting-nft-infor" className="flex items-center justify-start">
          <div className={`${no<=5&&'bg-yellow-600'} me-4 border w-9 h-9 flex items-center justify-center rounded-full ${!isInCart && 'text-xl font-semibold me-5'}`}>{no}</div>
          <div
            id="voting-nft-image"
            className={`me-3 ${!isInCart ? 'h-32 w-32' : 'h-20 w-20'} rounded-lg overflow-hidden`}
          >
            <img
              src={nft.image ? convertIpfsAddressToUrl(nft.image) || '' : ''}
              alt={nft.image || ''}
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div id="voting-nft-desc" className={`${!isInCart && 'h-32'} flex flex-col justify-between`}>
            <div>
              <div id="voting-nft-name" className={`mb-1 ${!isInCart ? 'text-xl' : 'font-medium'}`}>{nft.assetName}</div>
              {!isInCart ? <div id="nft-view" className="flex items-center me-4 mb-1">
                <span style={{ color: "rgba(0, 255, 117, 0.50)" }}>0&nbsp;</span>
                <MdOutlineRemoveRedEye size="1.5em" />
              </div> :
                <div id="nft-vote" className="flex items-center me-4 mb-1" style={{ color: "rgba(0, 255, 117, 0.50)" }}>
                  <span style={{ color: "rgba(0, 255, 117, 0.50)" }}> {nft.voteAmount}&nbsp;</span>
                  <LuVote size="1.2em" />
                </div>}
              <div id="nft-like" className="flex items-center">
                <span style={{ color: "rgba(0, 255, 117, 0.50)" }}>0&nbsp;</span>
                <FaRegHeart size="1.2em" />
              </div>
            </div>
            <div id="voting-nft-more" className="text-fog-1">
              {!isInCart ? "View infor" : ""}
            </div>
          </div>
        </div>
        {!isInCart && <div id="voting-status" className={`${!isInCart && 'h-32'}  text-right flex flex-col justify-between`}>
          <div className="text-right">
            <div className="mb-2">
              Currrent Votes
            </div>
            <div id="voting-number" className="flex items-center justify-end" style={{ color: "rgba(0, 255, 117, 0.50)" }}>
            {nft.voteAmount} &nbsp;<LuVote size={"1.5em"} />
            </div>
          </div>

          <button className="rounded-[20px] bg-fog-1 px-3 py-1 border border-fog-2 
          transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:text-green-500  hover:border-green-500"
            onClick={() => setShowCard(true)}>
            Vote now
          </button>
        </div>}
      </div>
    </Fragment>
  );
}
