
// helpers/keyStore/fileStore.ts
import fs from "fs";

export interface KeyPair {
  publicKey: string;
  privateKey: string;
  address?: string; // Có thể bỏ sau này
}

export async function getKeyFromFile(address: string): Promise<KeyPair | null> {
  const filePath = 'keypairs.json';

  if (!fs.existsSync(filePath)) {
    console.warn('⚠️ File keypairs.json không tồn tại');
    return null;
  }

  const data = fs.readFileSync(filePath, 'utf8');
  const keyPairs: KeyPair[] = JSON.parse(data);

  return keyPairs.find(kp => kp.address === address) || null;
}
