import { Lucid, Script, fromText } from "lucid-cardano";
import readValidator from "@/helpers/readValidator";
import { createDatumGrantSchema } from "@/constants/datumGrant";

type Props = {
  lucid: Lucid;
  title: string;
  policyIdMedRecord:string;
  requestorAddress: string;
  encyptAesKey:string;
  nonceAccess: string;
};

const lockGrant = async ({ lucid, title, policyIdMedRecord, requestorAddress,encyptAesKey, nonceAccess }: Props) => {
  try {
    const { paymentCredential }: any = lucid.utils.getAddressDetails(await lucid.wallet.address());

    // Tạo chính sách mint (minting policy)
    const mintingPolicy: Script = lucid.utils.nativeScriptFromJson({
      type: "all",
      scripts: [
        { type: "sig", keyHash: paymentCredential.hash },
        { type: "before", slot: lucid.utils.unixTimeToSlot(Date.now() + 1000000) },
      ],
    });

    const policyId = lucid.utils.mintingPolicyToId(mintingPolicy);
    const assetName = fromText(title);
    const fullAssetId = policyId + assetName;

    // Địa chỉ hợp đồng
    const validator = await readValidator.readValidatorGrant();
    const contractAddress = lucid.utils.validatorToAddress(validator);
    console.log("grant contract: ",contractAddress)
    // Tạo datum để gửi vào contract
    const ownerAddress = await lucid.wallet.address();
    const datum = createDatumGrantSchema(
      policyId,
      policyIdMedRecord,
      assetName,
      requestorAddress,
      ownerAddress,
      encyptAesKey,
      nonceAccess
    );

    // Tạo và thực thi giao dịch
    const tx = await lucid
      .newTx()
      .mintAssets({ [fullAssetId]: BigInt(1) })
      .attachMintingPolicy(mintingPolicy)
      .payToContract(contractAddress, { inline: datum }, { [fullAssetId]: BigInt(1) })
      .validTo(Date.now() + 200000)
      .complete();

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
