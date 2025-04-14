"use server";

import convertIpfsAddressToUrl from "@/helpers/convertIpfsAddressToUrl";
import { decryptFile } from "@/helpers/utils";
import { decryptAESKey } from "@/utils/test/cryptEc";
import { selfDecryptAESKeyWithX25519 } from "@/utils/test/encrypt";
import { hexToBase64 } from "@/utils/test/hexToBase64";

type ViewRequest = {
  userPrivateKey: string; // EC private key
  encryptKey?: string; // Chủ
  encryptNonce?: string; // Chủ
  ephemeralPublicKey?: string; // nếu là chủ
  encryptAesKeyGranted?: string; // người yêu cầu
  encryptNonceGranted?: string; // người yêu cầu
  publicKeyEcGrant?: string; // người yêu cầu
  ipfsCid: string;
};

export async function handleViewProcessing(input: ViewRequest) {
  try {
    let aesKey: string;
    console.log("input: ",input);
    // 1. Giải mã AES key
    if (input.encryptAesKeyGranted && input.encryptNonceGranted) {
      // Người được cấp quyền
      aesKey = decryptAESKey(
        hexToBase64(input.encryptAesKeyGranted!),
        input.encryptNonceGranted!,
        input.userPrivateKey!,
        input.publicKeyEcGrant!
      );
    } else if (input.ephemeralPublicKey && input.encryptNonce && input.encryptKey) {
      // Chủ sở hữu
      aesKey = selfDecryptAESKeyWithX25519(
        input.encryptKey,
        input.encryptNonce,
        input.ephemeralPublicKey,
        input.userPrivateKey
      );
    } else {
      throw new Error("Thiếu thông tin giải mã AES key.");
    }

    // 2. Tải file từ IPFS
    const ipfsUrl = convertIpfsAddressToUrl(`ipfs://${input.ipfsCid}`);
    if (!ipfsUrl) {
      throw new Error("URL IPFS không hợp lệ.");
    }

    const response = await fetch(ipfsUrl);
    if (!response.ok) {
      throw new Error("Lỗi khi tải file từ IPFS.");
    }

    const encryptedText = await response.text();
    const decryptedBlob = await decryptFile(encryptedText, aesKey);

    // 3. Chuyển blob sang base64 để gửi về client
    const arrayBuffer = await decryptedBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = buffer.toString("base64");

    return { success: true, data: base64Data }; // Trả về base64 string
  } catch (error: any) {
    console.error("Lỗi khi xử lý:", error);
    return { success: false, message: error.message };
  }
}
