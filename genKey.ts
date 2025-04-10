import nacl from 'tweetnacl';
import fs from 'fs';
import { encodeBase64 } from 'tweetnacl-util';

// Tạo địa chỉ ví giả
function generateFakeAddress(index: number): string {
  return `addr_test1vq${index.toString().padStart(4, '0')}abcxyz`;
}

// Đọc file keypairs.json nếu đã tồn tại
let keyPairs: any[] = [];
const filePath = 'keypairs.json';

if (fs.existsSync(filePath)) {
  const data = fs.readFileSync(filePath, 'utf8');
  keyPairs = JSON.parse(data);
}

// Tạo 1 cặp key mới
const newKeyPair = nacl.box.keyPair();
const newIndex = keyPairs.length + 1;

const newEntry = {
  address: generateFakeAddress(newIndex),
  publicKey: encodeBase64(newKeyPair.publicKey),
  privateKey: encodeBase64(newKeyPair.secretKey),
};

// Thêm vào danh sách
keyPairs.push(newEntry);

// Ghi lại vào file
fs.writeFileSync(filePath, JSON.stringify(keyPairs, null, 2));
console.log(`✅ Đã tạo keypair #${newIndex} và lưu vào "${filePath}"`);
