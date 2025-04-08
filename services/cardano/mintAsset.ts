import { Lucid, Script, fromText } from "lucid-cardano";

type Props = {
    lucid?: Lucid;
    title: string;
    description?: string;
    mediaType?: string;
    imageUrl?: string;
    customMetadata?: any;
    label: number;  // Thêm tham số label
};

const mintAssetService = async function ({ lucid, title, description, imageUrl, mediaType, customMetadata, label }: Props): Promise<any> {
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
            let tx = lucid
                .newTx()
                .mintAssets({ [policyId + assetName]: BigInt(1) })
                .validTo(Date.now() + 200000)  // Thời gian hết hạn giao dịch
                .attachMintingPolicy(mintingPolicy);  // Đính kèm minting policy

            // Nếu label là 721, đính kèm metadata vào giao dịch
            if (label === 721) {
                const cleanedData = Object.fromEntries(Object.entries(customMetadata).filter(([key, value]) => key !== ""));
                tx = tx.attachMetadata(721, {
                    [policyId]: {
                        [title]: {
                            name: title,
                            description: description,
                            documentLink: imageUrl,
                            mediaType: mediaType,
                            ...cleanedData,
                        },
                    },
                });
            }

            // Hoàn tất giao dịch
            const signedTx = await (await tx.complete()).sign().complete();

            // Gửi giao dịch và chờ xác nhận
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

export default mintAssetService;
