import { getAssetMintingSlot } from "@/helpers/fetchAsset/fetchAssetsByProperty";
import { fetchAuthorAddressAsset } from "@/helpers/fetchAsset/fetchAssetsFromAddress";
import { Lucid, Script, fromText } from "lucid-cardano";
import { Data } from "lucid-cardano";
type Props = {
    lucid: Lucid;
    policyId: string;
    assetName: string;
};

const burnAsset = async function ({ lucid, policyId, assetName }: Props) {
    try {
        if (lucid) {
           
            const unit = policyId + assetName;
            const slot = await getAssetMintingSlot(unit, lucid);
            const address = await fetchAuthorAddressAsset(unit);
            console.log(slot)
            const { paymentCredential }: any = lucid.utils.getAddressDetails(address);
            const keyHash = paymentCredential.hash;
            const mintingPolicy: Script = lucid.utils.nativeScriptFromJson({
                type: "all",
                scripts: [
                    { type: "sig", keyHash: keyHash },
                    { type: "before", slot: slot},
                ],
            });



 
                
              
            
            const tx = await lucid
                .newTx()
                .mintAssets({ [unit]: BigInt(-1) }) // hoặc Data.empty()
                .validTo(Date.now() + 200000)
                .attachMintingPolicy(mintingPolicy)
                .complete();
            const signedTx = await tx.sign().complete();
            const txHash = await signedTx.submit();
            // const txHash=1;
            return { txHash, policyId, assetName };
        }
    } catch (error) {
        console.error(error);
    }
};

export default burnAsset;
