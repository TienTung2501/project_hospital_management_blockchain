"use server";
import * as bip39 from 'bip39';
import { ec as EC } from 'elliptic';
import * as nacl from 'tweetnacl';
import fs from 'fs';

const ec = new EC('secp256k1');

// ✅ EC keypair từ mnemonic (secp256k1)
function generateECKeypairFromMnemonic(mnemonic: string) {
  const seed = bip39.mnemonicToSeedSync(mnemonic); // Tạo seed từ mnemonic
  const privateKeyHex = seed.slice(0, 32).toString('hex'); // Lấy 32 byte đầu tiên làm private key
  const key = ec.keyFromPrivate(privateKeyHex); // Tạo EC keypair từ private key

  return {
    ecPrivateKeyHex: key.getPrivate('hex'), // Private key dưới dạng hex
    ecPublicKeyHex: key.getPublic(true, 'hex'), // Public key dưới dạng compressed (true cho public key nén)
  };
}

// ✅ X25519 keypair từ mnemonic
function generateX25519KeypairFromMnemonic(mnemonic: string) {
  const seed = bip39.mnemonicToSeedSync(mnemonic); // Tạo seed từ mnemonic
  const privateKey = seed.slice(0, 32); // Lấy 32 byte đầu tiên làm private key cho X25519
  const keypair = nacl.box.keyPair.fromSecretKey(privateKey); // Tạo X25519 keypair từ private key

  return {
    x25519PrivateKeyHex: Buffer.from(keypair.secretKey).toString('hex'),
    x25519PublicKeyHex: Buffer.from(keypair.publicKey).toString('hex'),
  };
}

// Hàm tạo ví ngẫu nhiên từ mnemonic
function randomAddress(index: number): string {
  return `addr_test1quser${index}${Math.floor(Math.random() * 10000)}`; // Tạo địa chỉ ví ngẫu nhiên
}

type Wallet = {
  mnemonic: string;
  address: string;
  ecPrivateKeyHex: string;
  ecPublicKeyHex: string;
  x25519PrivateKeyHex: string;
  x25519PublicKeyHex: string;
};

// Hàm tạo ví từ mnemonic với cả EC và X25519 keypairs
function generateWallets(count = 2): Wallet[] {
  const wallets: Wallet[] = [];

  for (let i = 0; i < count; i++) {
    const mnemonic = bip39.generateMnemonic(); // Sinh mnemonic ngẫu nhiên
    const { ecPrivateKeyHex, ecPublicKeyHex } = generateECKeypairFromMnemonic(mnemonic); // Tạo cặp khóa EC từ mnemonic
    const { x25519PrivateKeyHex, x25519PublicKeyHex } = generateX25519KeypairFromMnemonic(mnemonic); // Tạo cặp khóa X25519 từ mnemonic
    const address = randomAddress(i + 1); // Tạo địa chỉ ví ngẫu nhiên

    wallets.push({
      mnemonic,
      address,
      ecPrivateKeyHex,
      ecPublicKeyHex,
      x25519PrivateKeyHex,
      x25519PublicKeyHex,
    });
  }

  return wallets;
}

// Sinh ví và lưu vào file 'wallets.json'
const wallets = generateWallets(); // Tạo 2 ví ngẫu nhiên
fs.writeFileSync('wallets.json', JSON.stringify(wallets, null, 2), 'utf-8');

console.log('✅ Đã tạo file wallets.json với', wallets.length, 'user.');
