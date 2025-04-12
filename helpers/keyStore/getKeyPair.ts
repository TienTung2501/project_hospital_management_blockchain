// helpers/keyStore/getKeyPair.ts
import { getKeyFromFile } from './fileStore';
// import { getKeyFromLocalStorage } from './localStore';
// import { getKeyFromMnemonic } from './mnemonicUtils';

export async function getKeyPair(address: string) {
  return await getKeyFromFile(address);
  // return getKeyFromLocalStorage();
  // return getKeyFromMnemonic("twelve word here...");
}
