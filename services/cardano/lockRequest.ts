import { createDatumRequestSchema } from "@/constants/datumRequest";
import readValidator from "@/helpers/readValidator";
import { fromText, Lucid, Script } from "lucid-cardano";
type Props = {
  lucid: Lucid;
  title: string;
  policyId?: string;
  policyIdMedRecord: string;
  ownerAddress: string;
  requestorPublicKey: string;
};
const lockRequest = async ({
  lucid,
  title,
  policyId: existingPolicyId,
  policyIdMedRecord,
  ownerAddress,
  requestorPublicKey,
}: Props) => {
  try {
    const requestorAddress = await lucid.wallet.address();
    const { paymentCredential }: any = lucid.utils.getAddressDetails(requestorAddress);

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

    // Địa chỉ contract
    const validator = await readValidator.readValidatorRequest();
    const contractAddress = lucid.utils.validatorToAddress(validator);

    // Tạo datum
    const datum = createDatumRequestSchema(
      policyId,
      policyIdMedRecord,
      assetName,
      requestorAddress,
      ownerAddress,
      requestorPublicKey
    );

    // Tạo transaction
    const txBuilder = lucid
      .newTx()
      .payToContract(contractAddress, { inline: datum }, { [fullAssetId]: BigInt(1) });

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
    throw new Error("Error during mint and lock request token");
  }
};
export default lockRequest;
