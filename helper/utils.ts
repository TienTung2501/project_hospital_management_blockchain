import { C, Data, Lucid, getAddressDetails, networkToId,Credential as LucidCredential } from "lucid-cardano";
import CryptoJS from "crypto-js";

export const CredentialSchema = Data.Enum([
    Data.Object({ VerificationKeyCredential: Data.Tuple([Data.Bytes()]) }),
    Data.Object({ ScriptCredential: Data.Tuple([Data.Bytes()]) }),
  ]);
  const PaymentCredentialSchema = CredentialSchema;
  const StakeCredentialSchema = Data.Enum([
    Data.Object({ Inline: Data.Tuple([CredentialSchema]) }),
    Data.Object({
      Pointer: Data.Tuple([
        Data.Integer(),
        Data.Integer(),
        Data.Integer(),
      ]),
    }),
  ]);
  export const AddressSchema = Data.Object({
    payment_credential: PaymentCredentialSchema,
    stake_credential: Data.Nullable(StakeCredentialSchema),
  });
type Credential = Data.Static<typeof CredentialSchema>;
type Address = Data.Static<typeof AddressSchema>;
function getCredential(credential: LucidCredential): Credential {
    switch (credential.type) {
      case "Script":
        return {
          ScriptCredential: [credential.hash] as [string],
        };
      case "Key":
        return {
          VerificationKeyCredential: [credential.hash] as [string],
        };
    }
  }
  
  function getLucidCredential(credential: Credential): LucidCredential {
    if ("VerificationKeyCredential" in credential) {
      return {
        type: "Key",
        hash: credential.VerificationKeyCredential[0],
      };
    }
  
    return {
      type: "Script",
      hash: credential.ScriptCredential[0],
    };
  }
  
  export function getAddressFromBech32(bech32Address: string): Address {
    const addressDetails = getAddressDetails(bech32Address);
    if (!addressDetails.paymentCredential) {
      throw Error("Invalid bech32 address' payment credential");
    }
  
    return {
      payment_credential: getCredential(
        addressDetails.paymentCredential,
      ),
      stake_credential: addressDetails.stakeCredential
        ? { Inline: [getCredential(addressDetails.stakeCredential)] }
        : null,
    };
  }
  
  export function getBech32FromAddress(lucid: Lucid, address: Address): string {
    const paymentCredential = getLucidCredential(address.payment_credential);
  
    if (!address.stake_credential || ("Inline" in address.stake_credential)) {
      const stakeCredential = address.stake_credential
        ? getLucidCredential(address.stake_credential["Inline"][0])
        : undefined;
      return lucid.utils.credentialToAddress(paymentCredential, stakeCredential);
    }
  
    return C.PointerAddress.new(
      networkToId(lucid.network),
      paymentCredential.type === "Key"
        ? C.StakeCredential.from_keyhash(
          C.Ed25519KeyHash.from_hex(paymentCredential.hash),
        )
        : C.StakeCredential.from_scripthash(
          C.ScriptHash.from_hex(paymentCredential.hash),
        ),
      C.Pointer.new(
        C.BigNum.from_str(address.stake_credential.Pointer[0].toString()),
        C.BigNum.from_str(address.stake_credential.Pointer[1].toString()),
        C.BigNum.from_str(address.stake_credential.Pointer[2].toString()),
      ),
    )
      .to_address()
      .to_bech32(undefined);
  }

 // utils/encryption.ts
// export async function encryptFile(file: File, key: string): Promise<Blob> {
//   const arrayBuffer = await file.arrayBuffer();

//   const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
//   const encrypted = CryptoJS.AES.encrypt(wordArray, key).toString();

//   const encryptedBlob = new Blob([encrypted], { type: "text/plain" }); // để đảm bảo IPFS nhận được file text
//   return encryptedBlob;
// }
export async function encryptFile(file: File, key: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const base64String = reader.result as string;

      const encrypted = CryptoJS.AES.encrypt(base64String, key).toString();
      const encryptedBlob = new Blob([encrypted], { type: "text/plain" });
      resolve(encryptedBlob);
    };

    reader.onerror = (err) => reject(err);

    reader.readAsDataURL(file); // đọc file thành chuỗi base64 "data:application/pdf;base64,..."
  });
}
// utils/encryption.ts
export async function decryptFile(encryptedBase64: string, aesKey: string): Promise<Blob> {
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedBase64, aesKey).toString(CryptoJS.enc.Utf8);

    if (!decrypted.startsWith("data:")) {
      throw new Error("Giải mã sai hoặc AES key không đúng");
    }

    const [prefix, base64] = decrypted.split(",");
    const mimeMatch = prefix.match(/data:(.*);base64/);
    const mimeType = mimeMatch ? mimeMatch[1] : "application/octet-stream";

    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    return new Blob([bytes], { type: mimeType });
  } catch (err) {
    console.error("Lỗi giải mã:", err);
    throw err;
  }
}


// export async function decryptFile(encryptedBase64: string, aesKey: string): Promise<Blob> {
//   try {
//     const decrypted = CryptoJS.AES.decrypt(encryptedBase64, aesKey).toString(CryptoJS.enc.Utf8);
    
//     if (!decrypted.startsWith("data:")) {
//       throw new Error("Định dạng base64 không hợp lệ hoặc AES key sai");
//     }

//     // Tách phần data URL: "data:application/pdf;base64,..."
//     const [prefix, base64] = decrypted.split(",");

//     // Lấy MIME type từ phần đầu
//     const mimeMatch = prefix.match(/data:(.*);base64/);
//     const mimeType = mimeMatch ? mimeMatch[1] : "application/pdf";

//     // Convert base64 về binary
//     const binary = atob(base64);
//     const bytes = new Uint8Array(binary.length);
//     for (let i = 0; i < binary.length; i++) {
//       bytes[i] = binary.charCodeAt(i);
//     }

//     return new Blob([bytes], { type: mimeType });
//   } catch (error) {
//     console.error("Lỗi giải mã file:", error);
//     throw error;
//   }
// }