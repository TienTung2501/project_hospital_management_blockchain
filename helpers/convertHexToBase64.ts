import { Buffer } from "buffer";

/**
 * Chuyển chuỗi Hex về dạng Base64.
 * @param hexStr Chuỗi hex đầu vào
 * @returns Chuỗi base64 tương ứng
 */
export function convertHexToBase64(hexStr: string): string {
  const buffer = Buffer.from(hexStr, 'hex');
  return buffer.toString('base64');
}
