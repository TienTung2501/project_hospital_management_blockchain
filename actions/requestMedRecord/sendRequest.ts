import { Lucid } from "lucid-cardano";
import lockRequest from "@/services/cardano/lockRequest";
import { convertBase64ToHex } from "@/helpers/convertBase64ToHex";
import { getEcPublicKeyByAddress } from "@/utils/test/getKey";

type SendRequestParams = {
  lucid: Lucid;
  title: string;
  policyId?: string;
  policyIdMedRecord: string;
  ownerAddress: string; // địa chỉ của người sở hữu hồ sơ
  requestorAddress: string; // địa chỉ người yêu cầu
};

export async function sendRequest({
  lucid,
  title,
  policyId,
  policyIdMedRecord,
  ownerAddress,
  requestorAddress,
}: SendRequestParams) {
  try {
    // 🔑 Lấy public key từ file keypair lưu local
    const publicEcRequest = await getEcPublicKeyByAddress(requestorAddress)!;
    

    // Gọi lockRequest để thực hiện mint & lock token
    const result = await lockRequest({
      lucid,
      title,
      policyId,
      policyIdMedRecord,
      ownerAddress,
      requestorPublicKey:publicEcRequest!,
    });

    return result;
  } catch (error) {
    console.error("❌ Gửi yêu cầu thất bại:", error);
    throw new Error("Gửi request thất bại");
  }
}
