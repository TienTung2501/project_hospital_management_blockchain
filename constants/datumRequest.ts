import { Data } from "lucid-cardano";
import { AddressSchema,getAddressFromBech32 } from "./utils";
const DatumInitial = Data.Object({
    policyId:  Data.Bytes(),
    policyIdMedRecord:  Data.Bytes(),
    assetName:  Data.Bytes(),
    requestorAddress:  AddressSchema, 
    ownerAddress:  AddressSchema, 
    requestorPublicKey: Data.Bytes(),
});

export type DatumRequest = Data.Static<typeof DatumInitial>;
export const DatumRequest = DatumInitial as unknown as DatumRequest;
export function createDatumRequestSchema(
  policyId: string,
  policyIdMedRecord:string,
  assetName: string,
  requestorAddress: string,
  ownerAddress: string,
  requestorPublicKey: string,
):string | undefined{
  try {
      const requestor =  getAddressFromBech32(requestorAddress);
      const owner =  getAddressFromBech32(ownerAddress);
      
      if (requestorAddress === undefined || ownerAddress === undefined) {
          return undefined;
      }
      
      const datum: DatumRequest = {
          policyId: policyId,
          policyIdMedRecord:policyIdMedRecord,
          assetName: assetName,
          requestorAddress: requestor,
          ownerAddress: owner,
          requestorPublicKey
      };
      
      const retdat = Data.to(datum, DatumRequest);
      return retdat;
  } catch (error) {
      console.error("Error:", error);
      return undefined;
  }
}
