"use client"

import type React from "react"

import { useContext, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import NFTPreview from "@/components/nft-preview"
import { Plus, Trash2 } from "lucide-react"
import { toast } from "react-toastify";
import { MetadataObject, NFTMintInfor } from "@/types/GenericsType";
import LucidContext from "@/contexts/components/LucidContext";
import { LucidContextType } from "@/types/LucidContextType";
import mintAsset from "@/services/cardano/mintAsset";
import { postCloudPinata } from "@/services/pinata/pinata";
import { encryptFile } from "@/helpers/utils";
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
const removeAccents = (str: string) =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
export default function CreatePage() {

  const [customFields, setCustomFields] = useState<{ name: string; value: string }[]>([{ name: "", value: "" }])
  const {lucidWallet, walletItem ,setIsLoading} = useContext<LucidContextType>(LucidContext);
  const [title, setTitle] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [description, setDescription] = useState("");
  const [mediaType, setMediaType] = useState("");
  const [imagePath, setImagePath] = useState("/placeholder.svg?height=400&width=400");
  const [image, setImage] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [metadatas, setMetadatas] = useState<MetadataObject[]>([{ key: "", value: "" }]);
  const [dateOfDocument, setDateOfDocument] = useState(""); // New state for date

  const resetForm = () => {
    setCustomFields([{ name: "", value: "" }]);
    setTitle("");
    setDescription("");
    setMediaType("");
    setImagePath("/placeholder.svg?height=400&width=400");
    setImage(null);
    setFileName("PNG, Video, Music, GIF, MP4 or MP3. Max 100mb");
    setMetadatas([{ key: "", value: "" }]);
    setDateOfDocument("");
    setHospitalName("");
  };
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

  const addCustomField = () => {
    setCustomFields([...customFields, { name: "", value: "" }]);
  };

  const removeCustomField = (index: number) => {
    const newFields = [...customFields];
    newFields.splice(index, 1);
    setCustomFields(newFields);
  };

  const updateCustomField = (index: number, key: "name" | "value", value: string) => {
    const newFields = [...customFields];
    newFields[index][key] = value;
    setCustomFields(newFields);
  };

  const handleSubmit = async () => {
        // Thu thập dữ liệu từ form
    const formData = {
      title,
      description,
      mediaType,
      image: imagePath, // URL hình ảnh hoặc dữ liệu mã hóa
      customFields,
    };

    console.log("Form data to submit:", formData);

    // Kiểm tra điều kiện trước khi gửi dữ liệu (ví dụ: nếu chưa kết nối ví, cần yêu cầu kết nối)
    if (!lucidWallet || walletItem.walletAddress === "") {
      toast.error("Làm ơn! Hãy kết nối ví trước khi thực hiện điều này");
      return;
    }
    if (!title||!fileName||!dateOfDocument||!description||!hospitalName) {
      toast.error("Vui lòng nhập đủ thông tin trước khi tạo!!!");
      return;
    }
    setIsLoading(true);

    try {

      // Chuyển metadata thành object để gửi đi (nếu cần)
      const customMetadata = convertMetadataToObj(metadatas);

      // Mã hóa file trước khi upload (nếu cần)
      const aesKey = CryptoJS.lib.WordArray.random(16).toString();
      const encryptedFile = await encryptFile(image as File, aesKey);
      
      // Upload lên Pinata (hoặc dịch vụ khác)
      const formDataForPinata = new FormData();
      formDataForPinata.append("file", encryptedFile);
      const uploadRes = await postCloudPinata(formDataForPinata);
      customMetadata['encryptKey'] = aesKey; // Thêm key vào customMetadata (thay 'some_key_value' bằng giá trị thực tế nếu cần)
      customMetadata['hashCIP'] = uploadRes.IpfsHash; // Thêm key vào customMetadata (thay 'some_key_value' bằng giá trị thực tế nếu cần)
      customMetadata['date'] = dateOfDocument; // Thêm key vào customMetadata (thay 'some_key_value' bằng giá trị thực tế nếu cần)
      customMetadata['hospitalName'] = removeAccents(hospitalName); // Thêm key vào customMetadata (thay 'some_key_value' bằng giá trị thực tế nếu cần)
      customMetadata['documentType'] = "medRecord"; // Thêm key vào customMetadata (thay 'some_key_value' bằng giá trị thực tế nếu cần)
 

      // Minting asset (ví dụ: sử dụng API mintAsset)
      const mintRes = await mintAsset({
        lucid: lucidWallet,
        customMetadata,
        description,
        imageUrl: "ipfs://" + uploadRes.IpfsHash,
        mediaType,
        title,
        label:721,
      });

      if (!mintRes.txHash) {
        throw new Error("Minting asset failed");
      }
      setIsLoading(false);
      toast.success("Minting asset successfully!");
      resetForm();
    } catch (error) {
      toast.error("Error during minting!");
    } finally {
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-white">Tạo hồ sơ</h1>
          <div className="space-y-2">
          <p className="text-sm text-white">Tải file lên</p>
          <div className="border-2 border-dashed border-indigo-600/50 rounded-md p-8 text-center bg-indigo-900/30">
            <p className="text-gray-300 mb-4">PNG, Video, Music, GIF, MP4 or MP3. Max 100mb</p>
            <div className="relative">
              <Button
                className="bg-blue-600 hover:bg-blue-700 w-full"
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                Tải
              </Button>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleChangeFile}
                required
              />
              {fileName && (
                <p className="text-gray-300 mt-4">File: {fileName}</p>
              )}
            </div>
          </div>
        </div>



          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">
              Tên hồ sơ
            </Label>
            <Input
              id="name"
              placeholder="Tên"
              className="bg-indigo-900/30 border-indigo-600/50 text-white"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">
              Tên bệnh viện( Viết không dấu)
            </Label>
            <Input
              id="name_hospital"
              placeholder="Tên bệnh viện"
              className="bg-indigo-900/30 border-indigo-600/50 text-white"
              value={hospitalName}
              onChange={(e) => setHospitalName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">
              Ngày vào viện
            </Label>
            <Input
              type="date"
              placeholder="Ngày"
              className="bg-indigo-900/30 border-indigo-600/50 text-white"
              value={dateOfDocument}
              onChange={(e) => setDateOfDocument(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="media-type" className="text-white">
              Media type
            </Label>
            <Input
              id="media-type"
              placeholder="Định dạng"
              readOnly
              className="bg-indigo-900/30 border-indigo-600/50 text-white"
              value={mediaType}
              onChange={(e) => setMediaType(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">
              Mô tả
            </Label>
            <Textarea
              id="description"
              placeholder="Mô tả"
              className="bg-indigo-900/30 border-indigo-600/50 text-white min-h-[150px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Custom meta data</h3>
            {customFields.map((field, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="Property name"
                  className="bg-indigo-900/30 border-indigo-600/50 text-white"
                  value={field.name}
                  onChange={(e) => updateCustomField(index, "name", e.target.value)}
                />
                <Input
                  placeholder="Property value"
                  className="bg-indigo-900/30 border-indigo-600/50 text-white"
                  value={field.value}
                  onChange={(e) => updateCustomField(index, "value", e.target.value)}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeCustomField(index)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={addCustomField}
              className="border-indigo-600/50 text-indigo-300"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Field
            </Button>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Fees</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-300">
                <span>Platform fee</span>
                <span>0.2</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Transaction fee</span>
                <span>0.3</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Estimated gas fee</span>
                <span>0.5</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="mint" />
              <label
                htmlFor="mint"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-300"
              >
                Do you want to mint?
              </label>
            </div>
          </div>

          <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleSubmit}>Create</Button>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Xem trước</h2>
          <NFTPreview
            image={mediaType.startsWith("image/") ? imagePath : "/placeholder.svg?height=400&width=400"}
            name={title || "Tên hồ sơ"}
            description={description || "Description"}
            mediaType={mediaType || "Media type"}
          />
        </div>
      </div>
    </div>
  )
}

