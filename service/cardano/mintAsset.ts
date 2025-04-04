import { Lucid, Script, fromText } from "lucid-cardano";

type Props = {
    lucid: Lucid;
    title: string;
    description: string;
    mediaType: string;
    imageUrl: string;
    dateOfDocument:string;
    encryptKey:string;
    hashCIP:string;
    customMetadata: any;
};

const mintAssetService = async function ({ lucid, title, description, imageUrl,hashCIP,dateOfDocument, mediaType,encryptKey, customMetadata }: Props): Promise<any> {
    try {
        if (lucid) {
            const { paymentCredential }: any = lucid.utils.getAddressDetails(await lucid.wallet.address());
            const mintingPolicy: Script = lucid.utils.nativeScriptFromJson({
                type: "all",
                scripts: [
                    { type: "sig", keyHash: paymentCredential.hash },
                    { type: "before", slot: lucid.utils.unixTimeToSlot(Date.now() + 1000000) },
                ],
            });
            const policyId: string = lucid.utils.mintingPolicyToId(mintingPolicy);

            const assetName = fromText(title);
            const cleanedData = Object.fromEntries(Object.entries(customMetadata).filter(([key, value]) => key !== ""));
            const tx = await lucid
            .newTx()
            .mintAssets({ [policyId + assetName]: BigInt(1) })
            .attachMetadata(721, {
                [policyId]: {
                    [title]: {
                        name: title,
                        description: description,
                        documentLink: imageUrl,
                        dateOfDocument:dateOfDocument,
                        hashCIP: hashCIP,
                        encryptKey:encryptKey,
                        mediaType: mediaType,
                        ...cleanedData,
                    },
                },
            })
            .validTo(Date.now() + 200000)
            .attachMintingPolicy(mintingPolicy)
            .complete();
            const signedTx = await tx.sign().complete();
            //console.log(signedTx);
            const txHash = await signedTx.submit();
            //console.log(txHash);
            await lucid.awaitTx(txHash);
            return { txHash, policyId, assetName };
        }
    } catch (error:any) {
        console.log(error);
        throw Error("",error);
    }
};

export default mintAssetService;
