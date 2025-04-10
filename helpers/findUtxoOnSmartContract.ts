import { Data, Lucid, UTxO } from "lucid-cardano";
import { DatumGrant } from "@/constants/datumGrant";
import { DatumRequest } from "@/constants/datumRequest";
import { UtxoGrant, UtxoRequest } from "@/types/GenericsType";
import readValidator from "./readValidator";
import { getAddressFromBech32, getBech32FromAddress } from "@/constants/utils";
import { convertHexToBase64 } from "./convertHexToBase64";


export async function getListUtxoFromRequestContractByAddress(lucid:Lucid,address: string): Promise<UtxoRequest[]> {
    // 🔸 Giả định có hàm load UTxO từ contract
    // Địa chỉ hợp đồng
    const validator = await readValidator.readValidatorRequest();
    const contractAddress = lucid.utils.validatorToAddress(validator);
    const utxos = await lucid.utxosAt(contractAddress);
    const result: UtxoRequest[] = [];
  
    for (const utxo of utxos) {
      const datum = Data.from<DatumRequest>(utxo.datum!, DatumRequest);
      if (!datum) continue;
  
      try {
        const parsed: UtxoRequest = {
          policyId: datum.policyId,
          policyIdMedRecord: datum.policyIdMedRecord,
          assetName: datum.assetName,
          title: convertHexToBase64(datum.assetName),
          requestorAddress: getBech32FromAddress(lucid,datum.requestorAddress),
          ownerAddress: getBech32FromAddress(lucid,datum.ownerAddress),
          requestorPublicKey: datum.requestorPublicKey,
        };
        
        if (parsed.requestorAddress === address) {
          result.push(parsed);
        }
      } catch (err) {
        console.warn(`⚠️ Không parse được UTxO:`, utxo);
      }
    }
  
    return result;
  }

export async function getUtxoFromGrantContractByAddress(lucid:Lucid,address:string) {
     // 🔸 Giả định có hàm load UTxO từ contract
    // Địa chỉ hợp đồng
    const validator = await readValidator.readValidatorGrant();
    const contractAddress = lucid.utils.validatorToAddress(validator);
    const utxos = await lucid.utxosAt(contractAddress);
  
    const result: UtxoGrant[] = [];
  
    for (const utxo of utxos) {
      const datum = Data.from<DatumGrant>(utxo.datum!, DatumGrant);
  
      if (!datum) continue;
  
      try {
        const parsed: UtxoGrant = {
          policyId: datum.policyId,
          policyIdMedRecord: datum.policyIdMedRecord,
          assetName: datum.assetName,
          title: convertHexToBase64(datum.assetName),
          requestorAddress: getBech32FromAddress(lucid,datum.requestorAddress),
          ownerAddress: getBech32FromAddress(lucid,datum.ownerAddress),
          encyptAesKey: datum.encyptAesKey,
          nonceAccess: datum.nonceAccess,
        };
  
        if (parsed.requestorAddress === address) {
          result.push(parsed);
        }
      } catch (err) {
        console.warn(`⚠️ Không parse được UTxO:`, utxo);
      }
    }
  
    return result;
}
export function filterUtxoByPolicyIdMedRecordFromRequestContract(// kiểm tra xem đã yêu cầu hay chưa nếu đã yêu cầu rồi thì hiển thị ra
  list: UtxoRequest[],
  policyIdMedRecord: string
): UtxoRequest[] {
  return list.filter((item) => item.policyIdMedRecord === policyIdMedRecord);
}


export async function filterUtxoByPolicyIdFromAddress(
  lucid: Lucid,
  assetName:string,
  policyIdMedRecord: string
) {
  const utxos:UTxO[] = await lucid.wallet.getUtxos();
  // Lọc các UTXO có chứa assetId khớp policyIdMedRecord
  const matched = utxos.filter((utxo) => {
    const units = Object.keys(utxo.assets); // [policyId + assetName]
    return units.some((unit) => {
      const policyId = unit.slice(0,56); // phần còn lại là assetName (hex)
      const unitAssetNameHex = unit.slice(56); // phần còn lại là assetName (hex)
      return unitAssetNameHex === assetName&&policyId!==policyIdMedRecord;
    });
  });
  console.log(matched)
  return matched;
}

export function filterUtxoByPolicyIdMedRecordFromGrantContract(// kiểm tra xem đã cấp quyèn hay chưa nếu đã cấp quyèn rồi thì hiển thị ra
  list: UtxoGrant[],
  policyIdMedRecord: string
): UtxoGrant[] {
  return list.filter((item) => item.policyIdMedRecord === policyIdMedRecord);
}
