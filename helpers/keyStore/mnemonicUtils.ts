import * as bip39 from "bip39";
const bip32 = require("bip32"); // dùng require() để tránh lỗi ESM
import { toHex } from "lucid-cardano";

export interface KeyPair {
  publicKey: string;
  privateKey: string;
}

const CARDANO_PATH = "m/1852'/1815'/0'/0/0";

/**
 * Trả về keypair từ 12 ký tự mnemonic
 */
export async function getKeyFromMnemonic(mnemonic: string): Promise<KeyPair> {
  if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error("❌ Mnemonic không hợp lệ");
  }

  const seed = await bip39.mnemonicToSeed(mnemonic);
  const root = bip32.fromSeed(seed);
  const child = root.derivePath(CARDANO_PATH);

  if (!child.privateKey || !child.publicKey) {
    throw new Error("❌ Không tạo được keypair từ mnemonic");
  }

  return {
    privateKey: toHex(child.privateKey),
    publicKey: toHex(child.publicKey),
  };
}
