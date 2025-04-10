import { Lucid } from "lucid-cardano";
import unlockAccessUTxO from "@/services/cardano/unlockAsset";

type CancelGrantParams = {
  lucid: Lucid;
  requestorAddress: string;
  policyId?: string;
  assetName?: string;
  cancelAll?: boolean;
};

export async function cancelGrant({
  lucid,
  requestorAddress,
  policyId,
  assetName,
  cancelAll = false,
}: CancelGrantParams) {
  try {
    const result = await unlockAccessUTxO({
      lucid,
      userRole: "owner",
      address: requestorAddress,
      policyId: cancelAll ? undefined : policyId,
      assetName: cancelAll ? undefined : assetName,
      unlockAll: cancelAll,
    });

    return result;
  } catch (error) {
    console.error("❌ Cancel request thất bại:", error);
    throw new Error("Cancel request thất bại");
  }
}
