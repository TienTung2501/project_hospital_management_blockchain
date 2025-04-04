import axios from "axios";
import { AssetType } from "~/types/GenericsType";

const PROJECT_ID = "preview5ZEeQD8I1W8MHLEwlKy7NEmXKjSPJhRZ";
const headers = {
  project_id: PROJECT_ID,
};
const getSpecificAsset = async (assetId: string) => {
  try {
    const url = `https://cardano-preview.blockfrost.io/api/v0/assets/${assetId}`;
    const response = await axios.get(url, { headers });
    return response.data; 
  } catch (error: any) {
    console.error("Error:", error.response.data);
    throw error; 
  }
};
export {
    getSpecificAsset,
  
};
  