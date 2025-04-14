import { Data } from "lucid-cardano";
import { AddressSchema,getAddressFromBech32 } from "./utils";
const DatumInitial = Data.Object({
    policyId:  Data.Bytes(),
    policyIdMedRecord:  Data.Bytes(),
    assetName:  Data.Bytes(),
    requestorAddress:  AddressSchema, 
    publicKeyEcGrant:Data.Bytes(),
    ownerAddress:  AddressSchema,
    encyptAesKey: Data.Bytes(),
    nonceAccess: Data.Bytes(),
});

export type DatumGrant = Data.Static<typeof DatumInitial>;
export const DatumGrant = DatumInitial as unknown as DatumGrant;
export function createDatumGrantSchema(
  policyId: string,
  policyIdMedRecord:string,
  assetName: string,
  requestorAddress: string,
  publicKeyEcGrant:string,
  ownerAddress: string,
  encyptAesKey: string,
  nonceAccess: string,
):string | undefined{
  try {
      const requestor =  getAddressFromBech32(requestorAddress);
      const owner =  getAddressFromBech32(ownerAddress);
      
      if (requestorAddress === undefined || ownerAddress === undefined) {
          return undefined;
      }
      
      const datum: DatumGrant = {
          policyId: policyId,
          policyIdMedRecord:policyIdMedRecord,
          assetName: assetName,
          requestorAddress: requestor,
          publicKeyEcGrant:publicKeyEcGrant,
          ownerAddress: owner,
          encyptAesKey,
          nonceAccess
      };
      
      const retdat = Data.to(datum, DatumGrant);
      return retdat;
  } catch (error) {
      console.error("Error:", error);
      return undefined;
  }
}
