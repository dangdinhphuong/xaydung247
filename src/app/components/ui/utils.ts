import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Filter out Figma inspector props to avoid React warnings
 * These props are added by Figma Make's inspector and should not be passed to DOM elements
 */
export function filterFigmaProps<T extends Record<string, any>>(props: T): Omit<T, '_fgT' | '_fgt' | '_fgS' | '_fgs' | '_fgB' | '_fgb'> {
  if (!props) return props;
  
  const { _fgT, _fgt, _fgS, _fgs, _fgB, _fgb, ...cleanProps } = props as any;
  
  return cleanProps as Omit<T, '_fgT' | '_fgt' | '_fgS' | '_fgs' | '_fgB' | '_fgb'>;
}