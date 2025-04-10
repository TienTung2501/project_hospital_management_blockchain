import * as cbor from "cbor-x";
import smc_validators from "@/lib/plutus.json";
import { SpendingValidator, fromHex, toHex } from "lucid-cardano";

export const validators_hospitals=smc_validators.validators;
const readValidatorRequest = async function (): Promise<SpendingValidator> {
    const validatorLockRequest = validators_hospitals[1];
    return {
        type: "PlutusV2",
        script: toHex(cbor.encode(fromHex(validatorLockRequest.compiledCode))),
    };
};
const readValidatorGrant = async function (): Promise<SpendingValidator> {
    const validatorLockGrant = validators_hospitals[0];
    return {
        type: "PlutusV2",
        script: toHex(cbor.encode(fromHex(validatorLockGrant.compiledCode))),
    };
};


const validators = {
    readValidatorRequest,
    readValidatorGrant,
};

export default validators;
