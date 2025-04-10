export type WalletItemType = {
    id?:number;
    walletBalance?: number;
    walletName: string;
    walletImage: string;
    walletAddress?: string;
    walletDownloadApi?: string;
    walletApi: () => Promise<any> | any;
    walletCheckApi: () => Promise<any> | any;
};
export type MetadataObject ={
    key?: string;
    value?: string;
}

export type NFTMintInfor ={
    fileURL?: string | null;
    title?: string;
    mediaType?: string;
    desc?: string;
    metadata?: MetadataObject[];
};
export type NftItemType = {
    assetName: string;
    authorAddress?: string;
    currentAddress?: string;
    description?: string;
    fingerprint?: string;
    image?: string;
    mediaType?: string;
    name?: string | any;
    policyId: string;
    sellerAddress?: string; 
    stakekeyAuthorAddress?: string;
    stakekeySellerAddress?: string;
    amountOfVote?:number;
    bidding?:boolean;
    voting?:boolean;
    priceBidding?: bigint;
    royalties?: bigint;
    id?: string;
    countOfTransaction?: number;
    createdAt?: string;
    status?: string;
    updatedAt?: string;
    validate?: boolean;
};
export type medRecord = {
    asset:string;//unit
    assetName:string;//assetname hex
    policyId:string;
    mediaType: string;
    title:string;// name in onchain metadata
    date:string;//in onchain metadata
    hospitalName:string;//in onchain metadata
    hashCIP:string;//in onchain metadata
    encryptKey:string;//in onchain metadata
    documentType:string;//in onchain metadata
    documentLink:string;//in onchain metadata
    description:string;//in onchain metadata
    ownerAddress:string;//in onchain metadata
};
export type UtxoRequest={
    policyId: string,
    policyIdMedRecord:string,
    assetName: string,
    title:string,
    requestorAddress: string,
    ownerAddress: string,
    requestorPublicKey: string,
}
export type UtxoGrant={
    policyId: string,
    policyIdMedRecord:string,
    assetName: string,
    title:string,
    requestorAddress: string,
    ownerAddress: string,
    encyptAesKey: string,
    nonceAccess: string,
}
type AssetType = {
    asset?: string;
    asset_name?: string;
    fingerprint?: string;
    policy_id?:string;
    quantity?:string;
    onchain_metadata?: {
        description?: string;
        image?: string;
        mediaType?: string;
        name?: string;
    };
};
type AssetBidType = {
    asset_name?: string;
    // authorAddress?: string;
    // bidderAddress?:string;
    // winnerAddress?:string;
    stakeKeyBidder?:string;
    stakeKeyWinner?:string;
    stakeKeyAuthor?:string;
    priceBidding?: bigint;
//    royalties?: bigint;
    amountConstraint?:bigint;// ràng buộc giá
    description?: string;
    image?: string;
    mediaType?: string;
    title?: string;
    fingerprint?: string;
    policy_id?:string;
    quantity?:string;
    voteAmount?:number;
};
type AssetLock={
    assetNameHex?:string;
    assetName?:string;
    policyId?:string;
    image?:string;
    voteAmount?:number;
    bidder?:string;
    auction?:string;
}
type InforAssetVoteType={
    assetName?:string;
    voteAmount?:number;
}
