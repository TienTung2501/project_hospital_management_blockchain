"use server";
import fs from 'fs';

type Wallet = {
  mnemonic: string;
  address: string;
  ecPrivateKeyHex: string;
  ecPublicKeyHex: string;
  x25519PrivateKeyHex: string;
  x25519PublicKeyHex: string;
};

// Hàm load ví từ file JSON
function loadWallets(filePath = 'wallets.json'): Wallet[] {
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

// Lấy public key của EC ví theo địa chỉ
export async function getEcPublicKeyByAddress(address: string, filePath = 'wallets.json'): Promise<string | null> {
  try {
    const wallets = loadWallets(filePath); // Load danh sách ví từ file
    const wallet = wallets.find(w => w.address === address); // Tìm ví theo địa chỉ
    return wallet?.ecPublicKeyHex || null; // Trả về public key hoặc null nếu không tìm thấy
  } catch (error) {
    console.error("Error reading wallets:", error);
    return null;
  }
}

// Lấy private key của EC ví theo địa chỉ
export async function getEcPrivateKeyByAddress(address: string, filePath = 'wallets.json'): Promise<string | null> {
  try {
    const wallets = loadWallets(filePath); // Load danh sách ví từ file
    const wallet = wallets.find(w => w.address === address); // Tìm ví theo địa chỉ
    return wallet?.ecPrivateKeyHex || null; // Trả về private key hoặc null nếu không tìm thấy
  } catch (error) {
    console.error("Error reading wallets:", error);
    return null;
  }
}

// Hàm lấy cặp khóa X25519 theo địa chỉ ví
export async function getX25519PublicKeyByAddress(address: string, filePath = 'wallets.json'): Promise<string | null> {
  try {
    const wallets = loadWallets(filePath); // Load danh sách ví từ file
    const wallet = wallets.find(w => w.address === address); // Tìm ví theo địa chỉ
    return wallet?.x25519PublicKeyHex || null; // Trả về public key X25519 hoặc null nếu không tìm thấy
  } catch (error) {
    console.error("Error reading wallets:", error);
    return null;
  }
}

// Hàm lấy private key X25519 theo địa chỉ ví
export async function getX25519PrivateKeyByAddress(address: string, filePath = 'wallets.json'): Promise<string | null> {
  try {
    const wallets = loadWallets(filePath); // Load danh sách ví từ file
    const wallet = wallets.find(w => w.address === address); // Tìm ví theo địa chỉ
    return wallet?.x25519PrivateKeyHex || null; // Trả về private key X25519 hoặc null nếu không tìm thấy
  } catch (error) {
    console.error("Error reading wallets:", error);
    return null;
  }
}
