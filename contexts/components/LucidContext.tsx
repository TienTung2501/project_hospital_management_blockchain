'use client';
import { createContext } from "react";
import { LucidContextType } from "@/type/LucidContextType";

const LucidContext = createContext<LucidContextType>(null!);

export default LucidContext;