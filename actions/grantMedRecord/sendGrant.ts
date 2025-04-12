import { Lucid } from "lucid-cardano";
import lockGrant from "@/services/cardano/lockGrant";
import { getKeyPairByAddress } from "@/helpers/getKeyPairByAddress"; // Hàm tự viết để lấy publicKey theo address
import { grantAccessToAESKey } from "@/utils/test/cryptEc";
import { decryptWithPrivateKeyRSA } from "@/utils/test/cryptEc";
import { getEcPrivateKeyByAddress, getPrivateKeyByAddress } from "@/utils/test/getKey";
import { base64ToHex } from "@/utils/test/base64ToHex";

type SendGrantParams = {
  lucid: Lucid;
  title: string;
  policyIdMedRecord: string;
  aesKeyEncryptedByOwner: string;
  requestorAddress: string; // địa chỉ người yêu cầu
  requestorPublicKey: string; // địa chỉ người yêu cầu
};

export async function sendGrant({
  lucid,
  title,
  policyIdMedRecord,
  requestorAddress,
  aesKeyEncryptedByOwner,
  requestorPublicKey,
}: SendGrantParams) {
  try {
    // 🔑 Lấy public key từ file keypair lưu local
    const privateKeyGrant = getPrivateKeyByAddress(await lucid.wallet.address())!;
    const privateEcGrant = getEcPrivateKeyByAddress(await lucid.wallet.address())!;
    const aesKeyDecryptedByOwner = decryptWithPrivateKeyRSA(aesKeyEncryptedByOwner, privateKeyGrant);
    const { accessNonce, encryptedAESKey } = grantAccessToAESKey(aesKeyDecryptedByOwner, privateEcGrant, requestorPublicKey);
    const encryptedAESKeyHex=base64ToHex(encryptedAESKey);
    // Gọi lockRequest để thực hiện mint & lock token
    const result = await lockGrant({
      lucid,
      title,
      policyIdMedRecord,
      requestorAddress,
      encyptAesKey:encryptedAESKeyHex,
      nonceAccess:accessNonce,
    });

    return result;
  } catch (error) {
    console.error("❌ Gửi yêu cầu thất bại:", error);
    throw new Error("Gửi request thất bại");
  }
}
