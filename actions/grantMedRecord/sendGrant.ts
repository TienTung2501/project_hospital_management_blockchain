import { Lucid } from "lucid-cardano";
import lockGrant from "@/services/cardano/lockGrant";
import { getKeyPairByAddress } from "@/helpers/getKeyPairByAddress"; // Hàm tự viết để lấy publicKey theo address

type SendGrantParams = {
  lucid: Lucid;
  title: string;
  policyIdMedRecord: string;
  ownerAddress: string; // địa chỉ của người sở hữu hồ sơ
  requestorAddress: string; // địa chỉ người yêu cầu
};

export async function sendGrant({
  lucid,
  title,
  policyIdMedRecord,
  ownerAddress,
  requestorAddress,
}: SendGrantParams) {
  try {
    // 🔑 Lấy public key từ file keypair lưu local
    const requestorPublicKey =  getKeyPairByAddress(requestorAddress)?.publicKey;
    if (!requestorPublicKey) {
      throw new Error("Không tìm thấy publicKey của requestor");
    }

    // Gọi lockRequest để thực hiện mint & lock token
    const result = await lockGrant({
      lucid,
      title,
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
