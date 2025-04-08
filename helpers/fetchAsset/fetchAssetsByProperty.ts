import axios from "axios";
import { AssetType } from "@/types/GenericsType";
import { Lucid } from "lucid-cardano";

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
export const getAssetMintingSlot = async (
  assetId: string,
  lucid: Lucid
): Promise<number> => {
  try {
    // B1: Lấy thông tin asset
    const assetData = await getSpecificAsset(assetId);
    const initialTx = assetData.initial_mint_tx_hash;

    if (!initialTx) throw new Error("Không tìm thấy tx mint đầu tiên");

    // B2: Lấy danh sách transaction liên quan tới asset
    const txListUrl = `https://cardano-preview.blockfrost.io/api/v0/assets/${assetId}/transactions`;
    const txRes = await axios.get(txListUrl, { headers });
    const txs = txRes.data;

    // B3: Tìm transaction khớp với initial mint
    const mintTx = txs.find((tx: any) => tx.tx_hash === initialTx);
    if (!mintTx?.block_time) throw new Error("Không tìm thấy block_time");

    // B4: Chuyển sang slot
    return lucid.utils.unixTimeToSlot(mintTx.block_time * 1000);
  } catch (error: any) {
    console.error("Lỗi khi lấy slot mint:", error.message);
    throw error;
  }
};