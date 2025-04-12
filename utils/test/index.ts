import { base64ToHex } from "./base64ToHex";
import { encryptAESKey, decryptAESKey } from "./cryptEc";
import { selfDecryptAESKeyWithX25519, selfEncryptAESKeyWithX25519 } from "./encrypt";
import {
  getEcPrivateKeyByAddress,
  getEcPublicKeyByAddress,
  getX25519PrivateKeyByAddress,
  getX25519PublicKeyByAddress,
} from "./getKey";
import CryptoJS from "crypto-js";

async function main() {
  // ✅ Step 1: Tạo AES Key ngẫu nhiên (128-bit)
  const aesKey = CryptoJS.lib.WordArray.random(16).toString();
  console.log("aesKey gốc:", aesKey);

  // ✅ Step 2: Lấy thông tin người cấp (grantor)
  const addressGrant = "addr_test1qqja25tffmwywjufeycgn86zj7slfj9w4wh5a7ft4png47ue0r2q9x4995mt5xscmehf5swm6qx4flkg98euf3rk45usuerp08";
  const publicX25519Grant = await getX25519PublicKeyByAddress(addressGrant)!;
  const privateX25519Grant = await getX25519PrivateKeyByAddress(addressGrant)!;
  const publicEcGrant = await getEcPublicKeyByAddress(addressGrant)!;
  const privateEcGrant = await getEcPrivateKeyByAddress(addressGrant)!;

  // ✅ Step 3: Lấy thông tin người yêu cầu (requestor)
  const addressRequestor = "addr_test1qrd8ej20lpv6v5vekyl3jjf2t6epx55z4vpzkj5vek4cv36nj58977vmtk2mhlgcw3s5452csfn0up8mewunxhm95tqqxesdk6";
  const publicEcRequest = await getEcPublicKeyByAddress(addressRequestor)!;
  const privateEcRequest = await getEcPrivateKeyByAddress(addressRequestor)!;

  if (!publicX25519Grant || !privateX25519Grant) {
    throw new Error("Không tìm thấy đủ khóa để tiến hành mã hóa/giải mã.");
  }
  
  // tự mã hóa:
  // ✅ Step 4: Chủ sở hữu cấp quyền truy cập AES Key cho requestor
  const encrypted = selfEncryptAESKeyWithX25519(
    aesKey,
    publicX25519Grant
  );

  console.log("Encrypted AES Key for requestor:", encrypted.ciphertextHex);
  console.log("Nonce gửi kèm:", encrypted.nonceHex);
  console.log("ephemeralPublicKeyHex gửi kèm:", encrypted.ephemeralPublicKeyHex);

  // ✅ Step 5: Người nhận giải mã AES Key
  const decryptedKey = selfDecryptAESKeyWithX25519(
    encrypted.ciphertextHex,
    encrypted.nonceHex,
    encrypted.ephemeralPublicKeyHex,
    privateX25519Grant
  );

  console.log("aesKey giải mã:", decryptedKey);
  console.log("✅ Giải mã đúng:", decryptedKey === aesKey);
// ok rồi đã xong phần mã hóa.
  // ✅ Step 4: Chủ sở hữu cấp quyền truy cập AES Key cho requestor
  const { accessNonce, encryptedAESKey } = encryptAESKey(
    decryptedKey,
    privateEcGrant!,
    publicEcRequest!
  );


  console.log("Encrypted AES Key for requestor base64:", encryptedAESKey);
  console.log("Encrypted AES Key for requestor hex:", base64ToHex(encryptedAESKey));
  console.log("Nonce gửi kèm:", accessNonce);

  // ✅ Step 5: Người nhận giải mã AES Key
  const decryptedKeyEC = decryptAESKey(      // ✅ Step 5: Người nhận giải mã AES Key phải chuyển encrypt hex to base
    encryptedAESKey,
    accessNonce,
    privateEcRequest!,
    publicEcGrant!
  );
  console.log("aesKey giải mã:", aesKey);
  console.log("✅ Giải mã đúng:", decryptedKeyEC === aesKey);

}

main().catch(console.error);
