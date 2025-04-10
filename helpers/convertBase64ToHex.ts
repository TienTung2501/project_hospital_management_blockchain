import { Buffer } from "buffer";

/**
 * Chuyển một chuỗi Base64 (dạng publicKey/privateKey tweetnacl) thành Hex.
 * @param base64Str Chuỗi Base64 đầu vào
 * @returns Chuỗi Hex tương ứng
 */
export function convertBase64ToHex(base64Str: string): string {
  const buffer = Buffer.from(base64Str, 'base64');
  return buffer.toString('hex');
}
