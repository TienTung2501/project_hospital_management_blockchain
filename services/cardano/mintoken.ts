import { Lucid, Script, fromText } from "lucid-cardano";

type Props = {
    lucid: Lucid;
    title: string;
};

const mintTokenService = async function ({ lucid, title }: Props): Promise<any> {
    try {
        if (lucid) {
            // Lấy địa chỉ của ví và các thông tin liên quan
            const { paymentCredential }: any = lucid.utils.getAddressDetails(await lucid.wallet.address());

            // Định nghĩa chính sách minting (minting policy)
            const mintingPolicy: Script = lucid.utils.nativeScriptFromJson({
                type: "all",
                scripts: [
                    { type: "sig", keyHash: paymentCredential.hash },
                    { type: "before", slot: lucid.utils.unixTimeToSlot(Date.now() + 1000000) },
                ],
            });

            const policyId: string = lucid.utils.mintingPolicyToId(mintingPolicy);

            // Tên tài sản (asset) dựa trên title đã cho
            const assetName = fromText(title);

            // Làm sạch dữ liệu metadata (nếu có)
            // Bắt đầu xây dựng giao dịch
            const tx = await lucid
            .newTx()
            .mintAssets({ [policyId + assetName]: BigInt(1) })
            .validTo(Date.now() + 200000)
            .attachMintingPolicy(mintingPolicy)
            .complete();


            // Hoàn tất giao dịch
            const signedTx = await tx.sign().complete();
            //console.log(signedTx);
            const txHash = await signedTx.submit();
            await lucid.awaitTx(txHash);

            // Trả về thông tin giao dịch
            return { txHash, policyId, assetName };
        }
    } catch (error: any) {
        console.log(error);
        throw new Error("Error during minting", error);
    }
};

export default mintTokenService;
