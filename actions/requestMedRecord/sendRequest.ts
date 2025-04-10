import { Lucid } from "lucid-cardano";
import lockRequest from "@/services/cardano/lockRequest";
import { getKeyPairByAddress } from "@/helpers/getKeyPairByAddress"; // Hàm tự viết để lấy publicKey theo address
import { convertBase64ToHex } from "@/helpers/convertBase64ToHex";

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
    let requestorPublicKey;
    const keyPair = await getKeyPairByAddress(requestorAddress);
    if(keyPair){

      requestorPublicKey=convertBase64ToHex(keyPair?.publicKey);
    }
    if (!requestorPublicKey) {
      throw new Error("Không tìm thấy publicKey của requestor");
    }

    // Gọi lockRequest để thực hiện mint & lock token
    const result = await lockRequest({
      lucid,
      title,
      policyId,
      policyIdMedRecord,
      ownerAddress,
      requestorPublicKey,
    });

    return result;
  } catch (error) {
    console.error("❌ Gửi yêu cầu thất bại:", error);
    throw new Error("Gửi request thất bại");
  }
}
