"use client";

import { useState } from "react";
import { decryptFile } from "@/helpers/utils";
import { FaSpinner } from "react-icons/fa";

const DecryptPage = () => {
  const [aesKey, setAesKey] = useState("d6f71025571d5a3ea66bbb458a402dcf");
  const [decryptedBlobUrl, setDecryptedBlobUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [userPermissions, setUserPermissions] = useState({
    view: true,  // Quyền xem
    download: false,  // Quyền tải
    print: false,  // Quyền in
  });

  const encryptedFileUrl =
    "https://ivory-deaf-guineafowl-894.mypinata.cloud/ipfs/QmPaKy1v8CbGcN6sQXhtdg2cmYNjuy3B9USA4CU1JVUF6C?pinataGatewayToken=ZF-2NSDMZeCixzMlrJNPo0-N-mcMc51IGpbOuHB5uduKMyNRGFVkOu9QbYj8HO13";

  const handleDecryptFromIPFS = async () => {
    if (!aesKey) {
      alert("Vui lòng nhập AES key để giải mã.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(encryptedFileUrl);
      const encryptedText = await response.text();

      const decryptedBlob = await decryptFile(encryptedText, aesKey);
      const blobUrl = URL.createObjectURL(decryptedBlob);
      setDecryptedBlobUrl(blobUrl);
    } catch (error) {
      console.error("Lỗi giải mã:", error);
      alert("Giải mã thất bại, kiểm tra lại AES key và file.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (decryptedBlobUrl) {
      const link = document.createElement("a");
      link.href = decryptedBlobUrl;
      link.download = "document.pdf"; // Tên file khi tải về
      link.click();
    }
  };

  const handlePrint = () => {
    if (decryptedBlobUrl) {
      const printWindow = window.open(decryptedBlobUrl, "_blank");
      printWindow?.print();
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">🔐 Giải mã & Hiển thị PDF từ IPFS</h1>

      <div className="mb-6 max-w-xl mx-auto">
        <label className="block mb-2 font-medium">AES Key</label>
        <input
          type="text"
          className="w-full bg-gray-100 p-3 rounded-md border border-gray-300"
          value={aesKey}
          onChange={(e) => setAesKey(e.target.value)}
          placeholder="Nhập AES Key dùng để mã hóa"
        />
      </div>

      <div className="mb-6 text-center">
        <button
          onClick={handleDecryptFromIPFS}
          className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          {isLoading ? (
            <FaSpinner className="animate-spin inline-block" />
          ) : (
            "🔓 Giải mã file từ IPFS"
          )}
        </button>
      </div>

      {decryptedBlobUrl && (
        <div className="mt-6 relative w-full h-[80vh]">
          <iframe
            src={decryptedBlobUrl}
            className="w-full h-full rounded-lg border shadow-md"
            title="PDF đã giải mã"
          ></iframe>
        </div>
      )}

      {/* Chỉ hiển thị các nút nếu có quyền tải và in */}
      {userPermissions.view && (
        <div className="mt-6 text-center">
          {userPermissions.download && (
            <button
              onClick={handleDownload}
              className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition mb-4"
            >
              Tải về
            </button>
          )}

          {userPermissions.print && (
            <button
              onClick={handlePrint}
              className="px-6 py-3 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition"
            >
              In tài liệu
            </button>
          )}

          {/* Nếu không có quyền tải hoặc in, hiển thị thông báo */}
          {!userPermissions.download && !userPermissions.print && (
            <p className="text-gray-500">Bạn không có quyền tải hoặc in tài liệu này.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default DecryptPage;
