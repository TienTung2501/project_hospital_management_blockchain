import axios from "axios";
import { AssetType } from "@/types/GenericsType";

const PROJECT_ID = "preview5ZEeQD8I1W8MHLEwlKy7NEmXKjSPJhRZ";
const headers = {
  project_id: PROJECT_ID,
};
const fetchAssetsFromAddress = async (address: string) => {
  try {
    const url = `https://cardano-preview.blockfrost.io/api/v0/addresses/${address}`;
    const response = await axios.get(url, { headers });
    // console.log(response.data); // Hiển thị dữ liệu tài sản
    const amountList = response.data.amount.map((item: any) => item.unit);
    // console.log("Unit List:", amountList); // Hiển thị danh sách các giá trị unit
    return amountList; // Trả về danh sách các giá trị unit
  } catch (error: any) {
    // chỉ định kiểu dữ liệu của error là any
    console.error("Error:", error.response.data);
    throw error; // Ném lại lỗi để nó có thể được xử lý bên ngoài nếu cần
  }
};

import { medRecord } from "@/types/GenericsType";  // Đảm bảo đã nhập đúng type medRecord

const getAllAsset = async (address: string): Promise<medRecord[]> => {
  try {
    const units = await fetchAssetsFromAddress(address);
    
    const assetPromises = units
      .filter((unit: string) => unit !== "lovelace")
      .map((unit: string) => fetchAssetInformationFromUnit(unit));
    
    const assets :medRecord[]= await Promise.all(assetPromises);
    console.log(assets)
    // 🔍 Lọc ra các asset có documentType = "medRecord"
    const filteredAssets = assets.filter((asset) => {
      return (
        asset.documentType === "medRecord"
      );
    })
    return filteredAssets;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};




const fetchAssetInformationFromUnit = async (unit: string): Promise<medRecord> => {
  try {
    const url = `https://cardano-preview.blockfrost.io/api/v0/assets/${unit}`;
    const response = await axios.get(url, { headers });
    const { asset,asset_name,  onchain_metadata, policy_id } = response.data;

    // Nếu có onchain_metadata, trả về giá trị
    return {
      asset: asset,
      assetName: asset_name,
      policyId: policy_id,
      mediaType: onchain_metadata?.mediaType || "",
      title: onchain_metadata?.name || "",
      date: onchain_metadata?.date || "",
      hospitalName: onchain_metadata?.hospitalName || "",
      hashCIP: onchain_metadata?.hashCIP || "",
      encryptKey: onchain_metadata?.encryptKey || "",
      documentType: onchain_metadata?.documentType || "",
      documentLink: onchain_metadata?.documentLink || "",
      description: onchain_metadata?.description || "",
    };
  } catch (error: any) {
    console.error("Error:", error.response.data);
    throw error;
  }
};


const fetchAuthorAddressAsset = async (unit: string) => {
  if (unit !== "lovelace") {
    try {
      // const urlTxAsset = `https://cardano-preview.blockfrost.io/api/v0/assets/${unit}/transactions`;
      // console.log(urlTxAsset)
      //const response1 = await axios.get(urlTxAsset, { headers });
      const url = `https://cardano-preview.blockfrost.io/api/v0/assets/${unit}`;
      const response0 = await axios.get(url, { headers });
      // console.log(response0)
      //console.log(response1)
      // Kiểm tra xem phản hồi có dữ liệu không và mảng có phần tử không
      // if (response1.data && response1.data.length > 0) {
      //     const firstTransaction = response1.data[0]; // Lấy phần tử đầu tiên trong mảng

      //     const txHash: string = firstTransaction.tx_hash; // Lấy giá trị của trường "tx_hash"
      //     const urlAddress = `https://cardano-preview.blockfrost.io/api/v0/txs/${txHash}/utxos`;
      //     const response = await axios.get(urlAddress, { headers });

      //     // Trích xuất địa chỉ từ mảng "inputs" hoặc "outputs"
      //     const address = response.data.inputs[0]?.address || response.data.outputs[0]?.address;
      //     return address; // Trả về địa chỉ
      // } else {
      //     console.error("No data or empty array returned from the API");
      // }
      if (response0.data) {
        const txHash: string = response0.data.initial_mint_tx_hash; // Lấy giá trị của trường "tx_hash"
        const urlAddress = `https://cardano-preview.blockfrost.io/api/v0/txs/${txHash}/utxos`;
        const response = await axios.get(urlAddress, { headers });

        // Trích xuất địa chỉ từ mảng "inputs" hoặc "outputs"
        const address =
          response.data.inputs[0]?.address || response.data.outputs[0]?.address;
        return address; // Trả về địa chỉ
      } else {
        console.error("No data or empty array returned from the API");
      }
    } catch (error: any) {
      console.error("Error:", error.response.data);
      throw error;
    }
  }
};

export {
  getAllAsset,
  fetchAssetInformationFromUnit,
  fetchAssetsFromAddress,
  fetchAuthorAddressAsset,
};
