import CryptoJS from "crypto-js";
import { ec as EC } from "elliptic";

const ec = new EC("secp256k1");

export function encryptAESKey(
  aesKey: string,
  privateEcGrant: string,
  publicEcRequest: string
): { accessNonce: string; encryptedAESKey: string } {
  const accessNonce = CryptoJS.lib.WordArray.random(16).toString();

  const grantKey = ec.keyFromPrivate(privateEcGrant);
  const requestKey = ec.keyFromPublic(publicEcRequest, "hex");
  const sharedSecret = grantKey.derive(requestKey.getPublic());
  const sharedKeyRaw = CryptoJS.SHA256(sharedSecret.toString(16) + accessNonce);
  const sharedKey = CryptoJS.enc.Hex.parse(sharedKeyRaw.toString().slice(0, 32)); // 16 bytes

  // Tùy chọn: AES-CTR hoặc AES-CBC (dùng nonce làm IV)
  const iv = CryptoJS.enc.Hex.parse(accessNonce.slice(0, 32)); // 16 bytes

  const encrypted = CryptoJS.AES.encrypt(
    CryptoJS.enc.Hex.parse(aesKey), // AES key gốc đang là hex
    sharedKey,
    {
      iv,
      mode: CryptoJS.mode.CTR,
      padding: CryptoJS.pad.NoPadding,
    }
  );

  return {
    accessNonce,
    encryptedAESKey: encrypted.ciphertext.toString(), // hex, không base64 nữa
  };
}

export function decryptAESKey(
  encryptedAESKeyHex: string,
  accessNonce: string,
  privateEcRequest: string,
  publicEcGrant: string
): string {
  const requestKey = ec.keyFromPrivate(privateEcRequest);
  const grantKey = ec.keyFromPublic(publicEcGrant, "hex");
  const sharedSecret = requestKey.derive(grantKey.getPublic());
  const sharedKeyRaw = CryptoJS.SHA256(sharedSecret.toString(16) + accessNonce);
  const sharedKey = CryptoJS.enc.Hex.parse(sharedKeyRaw.toString().slice(0, 32));

  const iv = CryptoJS.enc.Hex.parse(accessNonce.slice(0, 32));

  // ✅ Tạo CipherParams hợp lệ
  const cipherParams = CryptoJS.lib.CipherParams.create({
    ciphertext: CryptoJS.enc.Hex.parse(encryptedAESKeyHex),
  });

  const decrypted = CryptoJS.AES.decrypt(cipherParams, sharedKey, {
    iv,
    mode: CryptoJS.mode.CTR,
    padding: CryptoJS.pad.NoPadding,
  });

  return decrypted.toString(CryptoJS.enc.Hex); // AES key hex gốc
}
