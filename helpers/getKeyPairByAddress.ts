"use server";
import fs from 'fs';

export interface KeyPair {
  address: string;
  publicKey: string;
  privateKey: string;
}

export async function getKeyPairByAddress(address: string): Promise<KeyPair | null> {
  const filePath = 'keypairs.json';

  if (!fs.existsSync(filePath)) {
    console.error('⚠️ File keypairs.json không tồn tại');
    return null;
  }

  const data = fs.readFileSync(filePath, 'utf8');
  const keyPairs: KeyPair[] = JSON.parse(data);

  const found = keyPairs.find(kp => kp.address === address);
  return found || null;
}
/*

cách sử dụng
import { getKeyPairByAddress } from './getKeyPairByAddress';

const address = 'addr_test1vq0001abcxyz';
const keyPair = getKeyPairByAddress(address);

if (keyPair) {
  console.log('✅ Keypair tìm được:', keyPair);
} else {
  console.log('❌ Không tìm thấy keypair với địa chỉ:', address);
}

*/