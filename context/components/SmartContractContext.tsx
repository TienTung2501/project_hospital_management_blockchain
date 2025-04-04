'use client';
import { createContext } from "react";
import { SmartContractType } from "@/type/SmartContractType";

const SmartContractContext = createContext<SmartContractType>(null!);

export default SmartContractContext;
