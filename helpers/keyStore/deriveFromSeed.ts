// helpers/keyStore/deriveFromSeed.ts
import * as bip39 from "bip39";
const bip32 = require("bip32"); // <- dùng require() thay vì import
import { fromHex, toHex } from "lucid-cardano";

export interface KeyPair {
  publicKey: string;
  privateKey: string;
}

const CARDANO_PATH = "m/1852'/1815'/0'/0/0"; // Đường dẫn ví Shelley, theo BIP44

export async function generateKeyPairFromMnemonic(mnemonic: string): Promise<KeyPair> {
  if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error("Mnemonic không hợp lệ");
  }

  const seed = await bip39.mnemonicToSeed(mnemonic);
  const root = bip32.fromSeed(seed);

  // Derive key theo path Cardano
  const child = root.derivePath(CARDANO_PATH);

  if (!child.privateKey || !child.publicKey) {
    throw new Error("Không tạo được keypair");
  }

  return {
    privateKey: toHex(child.privateKey),
    publicKey: toHex(child.publicKey),
  };
}
