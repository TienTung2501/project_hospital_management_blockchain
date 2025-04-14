import { Lucid } from "lucid-cardano";
import unlockAccessUTxO from "@/services/cardano/unlockAsset";

type CancelGrantParams = {
  lucid: Lucid;
  grantorAddress: string;
  policyId?: string;
  assetName?: string;
  cancelAll?: boolean;
};

export async function cancelGrant({
  lucid,
  grantorAddress,
  policyId,
  assetName,
  cancelAll = false,
}: CancelGrantParams) {
  try {
    const result = await unlockAccessUTxO({
      lucid,
      userRole: "owner",
      address: grantorAddress,
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
