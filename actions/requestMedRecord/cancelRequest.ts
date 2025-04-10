import { Lucid } from "lucid-cardano";
import unlockAccessUTxO from "@/services/cardano/unlockAsset";

type CancelRequestParams = {
  lucid: Lucid;
  requestorAddress: string;
  policyId?: string;
  assetName?: string;
  cancelAll?: boolean;
};

export async function cancelRequest({
  lucid,
  requestorAddress,
  policyId,
  assetName,
  cancelAll = false,
}: CancelRequestParams) {
  try {
    const result = await unlockAccessUTxO({
      lucid,
      userRole: "requestor",
      address: requestorAddress,
      policyId: cancelAll ? undefined : policyId,
      assetName: cancelAll ? undefined : assetName,
      unlockAll: cancelAll,
    });

    if (result?.txHash) {
      const { txHash } = result;
      console.log("✅ Hủy yêu cầu thành công:", txHash);
      return { txHash };
    } else {
      console.error("❌ Hủy yêu cầu thất bại hoặc không có giao dịch.");
    }
  } catch (error) {
    console.error("❌ Cancel request thất bại:", error);
    throw new Error("Cancel request thất bại");
  }
}
