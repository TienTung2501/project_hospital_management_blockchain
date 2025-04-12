import CryptoJS from "crypto-js";
import { ec as EC } from "elliptic";

const ec = new EC("secp256k1");

export function encryptAESKey(
  aesKey: string,
  privateEcGrant: string,
  publicEcRequest: string
): { accessNonce: string; encryptedAESKey: string } {
  // Tạo nonce
  const accessNonce = CryptoJS.lib.WordArray.random(16).toString();

  // Tính sharedKey
  const grantKey = ec.keyFromPrivate(privateEcGrant);
  const requestKey = ec.keyFromPublic(publicEcRequest, "hex");
  const sharedSecret = grantKey.derive(requestKey.getPublic());
  const sharedKey = CryptoJS.SHA256(sharedSecret.toString(16) + accessNonce).toString();

  // Mã hóa AES key bằng sharedKey
  const encryptedAESKey = CryptoJS.AES.encrypt(aesKey, sharedKey).toString();

  return { accessNonce, encryptedAESKey };
}
export function decryptAESKey(
  encryptedAESKey: string,
  accessNonce: string,
  privateEcRequest: string,
  publicEcGrant: string
): string {
  // Tính lại sharedKey từ phía requestor
  const requestKey = ec.keyFromPrivate(privateEcRequest);
  const grantKey = ec.keyFromPublic(publicEcGrant, "hex");
  const sharedSecret = requestKey.derive(grantKey.getPublic());
  const sharedKey = CryptoJS.SHA256(sharedSecret.toString(16) + accessNonce).toString();

  // Giải mã AES key
  const decryptedAESKey = CryptoJS.AES.decrypt(encryptedAESKey, sharedKey).toString(CryptoJS.enc.Utf8);
  return decryptedAESKey;
}
