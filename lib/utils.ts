import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
// smartrequest address:addr_test1wq5clh3lqacafs0pukwenuktnv29xlj00k60xnu39sckfdgwfr0qy
// smartgrant address:addr_test1wrukuulc4c9nm39asa0spqrgxcmkzu7adud0xr2wttn63eqpp6dys
