import { Lucid, Script, fromText } from "lucid-cardano";
import readValidator from "@/helpers/readValidator";
import { createDatumGrantSchema } from "@/constants/datumGrant";

type Props = {
  lucid: Lucid;
  title: string;
  policyId?: string;
  policyIdMedRecord:string;
  requestorAddress: string;
  publicKeyEcGrant:string;
  encyptAesKey:string;
  nonceAccess: string;
};

const lockGrant = async ({ lucid, title, policyId:existingPolicyId, policyIdMedRecord, requestorAddress,publicKeyEcGrant,encyptAesKey, nonceAccess }: Props) => {
  try {
    const { paymentCredential }: any = lucid.utils.getAddressDetails(await lucid.wallet.address());

   // Nếu policyId đã được truyền vào → dùng luôn, không cần mint
   let mintingPolicy: Script | undefined = undefined;
   let policyId = existingPolicyId;
   let needMint = false;
   if (!policyId) {
     // Tạo policy mới
     mintingPolicy = lucid.utils.nativeScriptFromJson({
       type: "all",
       scripts: [
         { type: "sig", keyHash: paymentCredential.hash },
         { type: "before", slot: lucid.utils.unixTimeToSlot(Date.now() + 1000000) },
       ],
     });

     policyId = lucid.utils.mintingPolicyToId(mintingPolicy);
     needMint = true;
   }
    const assetName = fromText(title);
    const fullAssetId = policyId + assetName;

    // Địa chỉ hợp đồng
    const validator = await readValidator.readValidatorGrant();
    const contractAddress = lucid.utils.validatorToAddress(validator);
    // Tạo datum để gửi vào contract
    const ownerAddress = await lucid.wallet.address();
    const datum = createDatumGrantSchema(
      policyId,
      policyIdMedRecord,
      assetName,
      requestorAddress,
      publicKeyEcGrant,
      ownerAddress,
      encyptAesKey,
      nonceAccess
    );

    // Tạo và thực thi giao dịch
    const txBuilder = lucid
      .newTx()
      .payToContract(contractAddress, { inline: datum }, { [fullAssetId]: BigInt(1) })
      
      
      if (needMint && mintingPolicy) {
        console.log("phải mint")
        txBuilder
          .mintAssets({ [fullAssetId]: BigInt(1) })
          .attachMintingPolicy(mintingPolicy);
      }
      const tx = await txBuilder.validTo(Date.now() + 200000).complete();

    const signedTx = await tx.sign().complete();
    const txHash = await signedTx.submit();
    await lucid.awaitTx(txHash);

    return { txHash, policyId, assetName };
  } catch (error: any) {
    console.error(error);
    throw new Error("Error during mint and lock token");
  }
};

export default lockGrant;
