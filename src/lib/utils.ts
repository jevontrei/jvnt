import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// named export -- must import with exact name
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
