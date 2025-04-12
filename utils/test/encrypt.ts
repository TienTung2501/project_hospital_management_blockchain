import * as nacl from 'tweetnacl'; 
import * as naclUtil from 'tweetnacl-util';
import { hexToBase64 } from './hexToBase64';

// Mã hóa AES key với publicKey của người nhận sử dụng X25519 và trả về kết quả dạng hex
export function selfEncryptAESKeyWithX25519(
  aesKey: string,
  recipientPublicKeyHex: string
): {
  ciphertextHex: string;
  nonceHex: string;
  ephemeralPublicKeyHex: string;
} {
  // Tạo ephemeral key pair (tạm thời) cho mã hóa bất đối xứng
  const ephemeralKeyPair = nacl.box.keyPair();

  // Chuyển đổi public key của người nhận từ hex sang byte array
  
  const recipientPublicKey = naclUtil.decodeBase64(hexToBase64(recipientPublicKeyHex));

  // Tạo nonce (24 bytes, thông thường cho các phương thức box)
  const nonce = nacl.randomBytes(24); // Đảm bảo nonce có độ dài 24 bytes

  // Mã hóa AES key với public key của người nhận và nonce
  const encryptedAESKey = nacl.box(
    naclUtil.decodeUTF8(aesKey), // Chuyển đổi aesKey sang byte array
    nonce,
    recipientPublicKey,
    ephemeralKeyPair.secretKey
  );

  // Trả về kết quả mã hóa dạng hex (không cắt quá sớm)
  return {
    ciphertextHex: Buffer.from(encryptedAESKey).toString('hex'),
    nonceHex: Buffer.from(nonce).toString('hex'),
    ephemeralPublicKeyHex: Buffer.from(ephemeralKeyPair.publicKey).toString('hex'),
  };
}

// Giải mã AES key với privateKey của người nhận sử dụng X25519, đầu vào và đầu ra dạng hex
// Hàm giải mã AES key với private key của người nhận sử dụng X25519
export function selfDecryptAESKeyWithX25519(
    ciphertextHex: string,
    nonceHex: string,
    ephemeralPublicKeyHex: string,
    recipientPrivateKey: string // Thay vì `recipientPrivateKeyHex`, bạn sẽ truyền vào dưới dạng byte array
  ): string {
    try {
      // Chuyển đổi các giá trị đầu vào từ hex về byte array
      const ephemeralPublicKey = Buffer.from(ephemeralPublicKeyHex, 'hex');
      const nonceDecoded = Buffer.from(nonceHex, 'hex');
      const ciphertextDecoded = Buffer.from(ciphertextHex, 'hex');
  
      // Chuyển private key của người nhận từ base64 về byte array
      const recipientPrivateKeyDecoded = naclUtil.decodeBase64(hexToBase64(recipientPrivateKey));
  // Debug: In ra các giá trị
  console.log('ephemeralPublicKeyHex (Sender):', ephemeralPublicKeyHex);
  console.log('recipientPrivateKey (Receiver):', recipientPrivateKey);
  console.log('ciphertextHex:', ciphertextHex);
  console.log('nonceHex:', nonceHex);
      // Kiểm tra xem khóa private và public có hợp lệ hay không (tính bảo mật)
      if (!nacl.box.before(ephemeralPublicKey, recipientPrivateKeyDecoded)) {
        throw new Error("Invalid keys for decryption");
      }
  
      // Giải mã AES key với private key của người nhận và ephemeral public key
      const decryptedAESKey = nacl.box.open(
        ciphertextDecoded, // Dữ liệu mã hóa
        nonceDecoded,
        ephemeralPublicKey, // Public key của người gửi (ephemeral public key)
        recipientPrivateKeyDecoded // Private key của người nhận (trực tiếp dưới dạng byte array)
      );
  
      if (!decryptedAESKey) {
        throw new Error("Decryption failed: The keys do not match or the ciphertext is corrupted");
      }
  
      // Trả về AES key đã giải mã dưới dạng chuỗi
      return naclUtil.encodeUTF8(decryptedAESKey); // Giải mã sang UTF-8
    } catch (error) {
      console.error("Decryption error:", error);
      throw error;
    }
  }

// Ví dụ sử dụng

