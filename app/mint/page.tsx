'use client';

import React, { useContext, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import Image from "next/image";
import { FaSpinner } from "react-icons/fa";  // Import spinner icon

import CheckBox from "@/components/CheckBox";
import MetadataProperty from "@/components/MetadataProperty";
import { MetadataObject, NFTMintInfor } from "@/type/GenericsType";
import LucidContext from "@/context/components/LucidContext";
import { LucidContextType } from "@/type/LucidContextType";
import mintAsset from "@/service/cardano/mintAsset";
import { postCloudPinata } from "@/service/pinata/pinata";
import images from "@/public/assets";
import {encryptFile} from "@/helper/utils";
import CryptoJS from "crypto-js";

function convertMetadataToObj(metadataArray: MetadataObject[]) {
  const resultObj: Record<string, string> = {};
  for (const item of metadataArray) {
    if (item.key && item.value) {
      resultObj[item.key] = item.value;
    }
  }
  return resultObj;
}

export default function MintingAsset() {
  const { lucidWallet, walletItem } = useContext<LucidContextType>(LucidContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mediaType, setMediaType] = useState("Media type asset");
  const [imagePath, setImagePath] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [fileName, setFileName] = useState("PNG, Video, Music, GIF, MP4 or MP3. Max 100mb");
  const [metadatas, setMetadatas] = useState<MetadataObject[]>([{ key: "", value: "" }]);
  const [dateOfDocument, setDateOfDocument] = useState(""); // New state for date
  const [isActionCreate, setIsActionCreate] = useState(false);  // Loading state for spinner

  useEffect(() => {
    return () => {
      if (imagePath) URL.revokeObjectURL(imagePath);
    };
  }, [imagePath]);

  const handleChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      const file = event.target.files[0];
      setImage(file);
      setImagePath(URL.createObjectURL(file));
      setFileName(file.name);
      setMediaType(file.type);
    }
  };

  const handleAddField = () => {
    setMetadatas(prev => [...prev, { key: "", value: "" }]);
  };

  const handleRemoveField = (index: number) => {
    const updated = [...metadatas];
    updated.splice(index, 1);
    setMetadatas(updated);
  };

  const handlePropertyChange = (index: number, updated: MetadataObject) => {
    const updatedList = [...metadatas];
    updatedList[index] = updated;
    setMetadatas(updatedList);
  };

  const handleGetNFTMintInfor = async () => {
    const nftMintInfor: NFTMintInfor = {
      fileURL: imagePath,
      title,
      mediaType,
      desc: description,
      metadata: metadatas,
    };

    try {
      setIsActionCreate(true);  // Show loading spinner
      if (!lucidWallet || walletItem.walletAddress === "") {
        throw new Error("Please, connect to wallet first!");
      }
      
      const customMetadata = convertMetadataToObj(metadatas);
      const formData = new FormData();
      console.log("start mint")
      const aesKey = CryptoJS.lib.WordArray.random(16).toString(); // Tạo AES key
      console.log(aesKey)

      const encryptedFile = await encryptFile(image as File, aesKey);
      formData.append("file", encryptedFile); // file đã được mã hóa

      customMetadata.encryptedKey = aesKey;
      customMetadata.originalFileType = image?.type || "application/pdf"; // Ghi nhớ loại file để giải mã đúng

     
            //formData.append("file", image as Blob);

      formData.append("pinataMetadata", JSON.stringify({ name: title }));
      formData.append("pinataOptions", JSON.stringify({ cidVersion: 0 }));

      const resData = await postCloudPinata(formData);
      const { txHash } = await mintAsset({
        lucid: lucidWallet,
        customMetadata,
        description,
        imageUrl: "ipfs://" + resData.IpfsHash,
        hashCIP: resData.IpfsHash,
        encryptKey:aesKey,
        dateOfDocument, // Passing the dateOfDocument
        mediaType,
        title,
      });

      if (!txHash) throw new Error("Minting asset failed");

      toast.success("Minting asset successfully!");
      setTitle("");
      setDescription("");
      setImagePath("");
      setMetadatas([{ key: "", value: "" }]);
      setMediaType("Media type asset");
      setDateOfDocument(""); // Clear the date field after minting
    } catch (error: any) {
      toast.error(error.message || "Minting asset failed!");
    } finally {
      setIsActionCreate(false);  // Hide loading spinner
    }
  };

  return (
    <div className="container max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-10 py-12">
      {/* Left side - Form */}
      <div className="lg:col-span-2">
        <div className="text-4xl font-semibold mb-8">Mint your asset</div>

        <div className="space-y-6">
      
        <div className="asset-input-box mb-6">
          <div className="asset-label mb-2">Upload file</div>
          <div className=" bg-fog-1 border border-fog-1 p-12 rounded-lg  text-white flex flex-col items-center">
            <i id="asset-upload-desc" className="mb-3 text-fog-2">PNG, Video, Music, GIF, MP4 or MP3. Max 100mb</i>
            <input type="file" className="block text-sm text-white 
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border file:border-fog-1
                file:bg-fog-1 file:text-white
                file:text-sm file:font-semibold
                hover:file:bg-white
                hover:file:text-purple-800
              "  onChange={handleChangeFile}

            />
          </div>
        </div>

          {/* Title */}
          <div>
            <label className="block mb-2 text-white">Title</label>
            <input
              type="text"
              className="w-full bg-fog-1 border border-fog-1 px-6 py-3 rounded-lg text-white"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-2 text-white">Description</label>
            <textarea
              rows={5}
              className="w-full bg-fog-1 border border-fog-1 px-6 py-3 rounded-lg text-white"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Date of Document */}
          <div>
            <label className="block mb-2 text-white">Date of Document</label>
            <input
              type="date"
              className="w-full bg-fog-1 border border-fog-1 px-6 py-3 rounded-lg text-white"
              value={dateOfDocument}
              onChange={(e) => setDateOfDocument(e.target.value)}
            />
          </div>

          {/* Metadata */}
          <div>
            <label className="block mb-2 text-white">Custom metadata</label>
            {metadatas.map((metadata, index) => (
              <MetadataProperty
                key={index}
                index={index}
                metadata={metadata}
                onChange={(idx, data) => handlePropertyChange(idx, data)}
                onRemove={() => handleRemoveField(index)}
              />
            ))}
            <button
              className="mt-3 p-2 bg-fog-1 text-white rounded hover:bg-green-400"
              onClick={handleAddField}
            >
              <FaPlus />
            </button>
          </div>

          {/* Mint Button */}
          <div id="btn-create-asset" className="text-center mt-8">
            <button className="font-semibold text-2xl rounded-lg
             bg-fog-1 px-14 py-2 border border-fog-2
             hover:bg-purple-3 hover:scale-110
             transition ease-in-out delay-150 
             hover:-translate-y-1
             duration-300 hover:border-green-500 hover:text-green-500"
              onClick={handleGetNFTMintInfor}>
              {isActionCreate ? (
                <FaSpinner className="animate-spin text-white" />  // Show spinner when minting
              ) : (
                "Create"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Right side - Preview */}
      <div>
        <div className="text-4xl font-semibold mb-6">Preview</div>
        <div className="p-6 rounded-2xl border border-fog-2 bg-fog-1">
          <div className="h-72 mb-6 overflow-hidden rounded-xl bg-fog-2 flex items-center justify-center">
            {imagePath ? (
              <img src={imagePath} className="max-h-full max-w-full object-contain" />
            ) : (
              <Image
                src={images.fileNotFound}
                alt="Image not found"
                width={200}
                height={150}
                className="object-contain animate-bounce"
              />
            )}
          </div>
          <div className="flex justify-between font-semibold">
            <span>{title || <i className="text-fog-2">Title</i>}</span>
            <span>{mediaType || <i className="text-fog-2">Type</i>}</span>
          </div>
          <p className="mt-3 text-sm">
            {description || <i className="text-fog-2">Description</i>}
          </p>
        </div>
      </div>

      {/* Full-screen Overlay Spinner */}
      {isActionCreate && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <FaSpinner className="animate-spin text-white text-6xl" />
        </div>
      )}
    </div>
  );
}
