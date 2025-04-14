import { Lucid, Data, fromText, TxComplete, Address, UTxO } from "lucid-cardano";
import readValidator from "@/helpers/readValidator";
import { DatumRequest, createDatumRequestSchema } from "@/constants/datumRequest";
import { DatumGrant, createDatumGrantSchema } from "@/constants/datumGrant";
import { redeemer } from "@/constants/redeemer";
import { getBech32FromAddress } from "@/constants/utils";
import { toast } from "react-toastify";

type UnlockParams = {
  lucid: Lucid;
  userRole: "owner" | "requestor";
  address: string; // user address
  policyId?: string;
  assetName?: string;
  unlockAll?: boolean;
};

async function unlockAccessUTxO({
  lucid,
  userRole,
  address,
  policyId,
  assetName,
  unlockAll = false
}: UnlockParams) {
  try {
    const validatorGrant = await readValidator.readValidatorGrant();
    const validatorRequest = await readValidator.readValidatorRequest();

    const contractGrantAddress = lucid.utils.validatorToAddress(validatorGrant);
    const contractRequestAddress = lucid.utils.validatorToAddress(validatorRequest);

    const allGrantUTxOs = await lucid.utxosAt(contractGrantAddress);
    const allRequestUTxOs = await lucid.utxosAt(contractRequestAddress);

    const matchedGrantUTxOs: UTxO[] = [];
    const matchedRequestUTxOs: UTxO[] = [];
    console.log("allGrantUTxOs", allGrantUTxOs)
    console.log("allRequestUTxOs", allRequestUTxOs)
    for (const utxo of allGrantUTxOs) {
      try {
        const datum:DatumGrant = Data.from<DatumGrant>(utxo.datum!, DatumGrant);

        const matchByAsset =
          policyId && assetName && datum.policyId === policyId && datum.assetName === assetName;
        const matchByAddress =
          unlockAll &&
          ((userRole === "owner" && getBech32FromAddress(lucid,datum.ownerAddress) === address) ||
            (userRole === "requestor" && getBech32FromAddress(lucid,datum.requestorAddress) === address));

        if (matchByAsset || matchByAddress) {
          matchedGrantUTxOs.push(utxo);

          // tìm UTxO tương ứng trong contractRequest để unlock cùng lúc
          for (const reqUTxO of allRequestUTxOs) {
            try {
              const reqDatum = Data.from<DatumRequest>(reqUTxO.datum!, DatumRequest);
              const sameAsset = reqDatum.policyIdMedRecord === datum.policyIdMedRecord && reqDatum.assetName === datum.assetName;
              const relatedAddress = getBech32FromAddress(lucid,datum.requestorAddress) === getBech32FromAddress(lucid,reqDatum.requestorAddress);
              if (sameAsset && relatedAddress) {
                matchedRequestUTxOs.push(reqUTxO);
              }
            } catch (e) {
              continue;
            }
          }
        }
      } catch (e) {
        continue;
      }
    }

    // Nếu user là requestor và chỉ muốn huỷ request, không liên quan đến Grant contract
    if (userRole === "requestor" && matchedGrantUTxOs.length === 0) {
      for (const utxo of allRequestUTxOs) {
        try {
          const datum = Data.from<DatumRequest>(utxo.datum!, DatumRequest);

          const matchByAsset =
            policyId && assetName && datum.policyId === policyId && datum.assetName === assetName;
          const matchByAddress = unlockAll && getBech32FromAddress(lucid,datum.requestorAddress) === address;

          if (matchByAsset || matchByAddress) {
            matchedRequestUTxOs.push(utxo);
          }
        } catch (e) {
          continue;
        }
      }
    }
    const txBuilder = lucid.newTx();

    if (matchedGrantUTxOs.length > 0) {
      txBuilder.collectFrom(matchedGrantUTxOs, redeemer).attachSpendingValidator(validatorGrant);
    }

    if (matchedRequestUTxOs.length > 0) {
      txBuilder.collectFrom(matchedRequestUTxOs, redeemer).attachSpendingValidator(validatorRequest);
    }
    console.log("matchedGrantUTxOs", matchedGrantUTxOs)
    console.log("matchedRequestUTxOs", matchedRequestUTxOs)
    console.log(address)
    const tx = await txBuilder.addSigner(address).complete();
    const signedTx = await tx.sign().complete();
    const txHash = await signedTx.submit();

    await lucid.awaitTx(txHash);
    return { txHash };
  } catch (e: any) {
    console.error("Unlock failed:", e);
    toast.error("Unlock transaction failed.");
    return undefined;
  }
}

export default unlockAccessUTxO;
// how to use
/* 
1.Chủ hồ sơ muốn unlock một UTxO theo asset
await unlockAccessUTxO({
  lucid,
  userRole: "owner",
  address: await lucid.wallet.address(),
  policyId: "...",
  assetName: "...",
});

2. Chủ hồ sơ muốn unlock tất cả các UTxO theo address
await unlockAccessUTxO({
  lucid,
  userRole: "owner",
  address: await lucid.wallet.address(),
  unlockAll: true,
});

3. Người yêu cầu muốn huỷ một yêu cầu cụ thể
await unlockAccessUTxO({
  lucid,
  userRole: "requestor",
  address: await lucid.wallet.address(),
  policyId: "...",
  assetName: "...",
});

4. Người yêu cầu muốn huỷ tất cả các yêu cầu
await unlockAccessUTxO({
  lucid,
  userRole: "requestor",
  address: await lucid.wallet.address(),
  unlockAll: true,
});


*/