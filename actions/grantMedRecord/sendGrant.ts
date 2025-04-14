"server onlly";
import { Lucid } from "lucid-cardano";
import lockGrant from "@/services/cardano/lockGrant";
import { getEcPrivateKeyByAddress, getEcPublicKeyByAddress, getX25519PrivateKeyByAddress } from "@/utils/test/getKey";
import { selfDecryptAESKeyWithX25519 } from "@/utils/test/encrypt";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { encryptAESKey } from "@/utils/test/cryptEc";
import { base64ToHex } from "@/utils/test/base64ToHex";


type SendGrantParams = {
  router: AppRouterInstance; // 👈 nhận router
  lucid: Lucid;
  title: string;
  policyId?: string;
  policyIdMedRecord: string;
  requestorAddress: string; // địa chỉ người yêu cầu
  requestorPublicKey: string; // địa chỉ người yêu cầu
  encryptKeyOnchain: string; // địa chỉ người yêu cầu
  ephemeralPublicKey: string;
  encryptNonce: string;
  hashCIP: string;
};

export async function sendGrant({
  router,
  lucid,
  title,
  policyId,
  policyIdMedRecord,
  requestorAddress,
  requestorPublicKey,
  ephemeralPublicKey,
  encryptNonce,
  encryptKeyOnchain,
  hashCIP,
}: SendGrantParams) {
  try {
    // 🔑 Lấy public key từ file keypair lưu local
    const address=await lucid.wallet.address();
    const privateX25519Grant = await getX25519PrivateKeyByAddress(address)!;
    const publicEcRequest = requestorPublicKey;
    const privateEcGrant = await getEcPrivateKeyByAddress(address)!;
    const publicKeyEcGrant = await getEcPublicKeyByAddress(address)!;
    const decryptedKey = selfDecryptAESKeyWithX25519(
      encryptKeyOnchain,
      encryptNonce,
      ephemeralPublicKey,
      privateX25519Grant!
    );
    
    // router.push(`/show/${hashCIP}?param=${decryptedKey}`)
    
     const { accessNonce, encryptedAESKey } = encryptAESKey(
        decryptedKey,
        privateEcGrant!,
        publicEcRequest!
      );
    // Gọi lockRequest để thực hiện mint & lock token
    const result = await lockGrant({
      lucid,
      title,
      policyId,
      policyIdMedRecord,
      requestorAddress,
      publicKeyEcGrant:publicKeyEcGrant!,
      encyptAesKey:base64ToHex(encryptedAESKey),
      nonceAccess:accessNonce,
    });

    return result;
  } catch (error) {
    console.error("Cấp quyền thất bại:", error);
    throw new Error("Cấp quyền thất bại");
  }
}
