// helpers/keyStore/localStore.ts
export interface KeyPair {
    publicKey: string;
    privateKey: string;
  }
  
  export function getKeyFromLocalStorage(): KeyPair | null {
    try {
      const data = localStorage.getItem("keypair");
      if (!data) return null;
  
      const keyPair: KeyPair = JSON.parse(data);
      return keyPair;
    } catch (err) {
      console.error("❌ Lỗi khi đọc keypair từ localStorage:", err);
      return null;
    }
  }
  