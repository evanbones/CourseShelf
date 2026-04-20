import type { SelectHTMLAttributes } from "react";

export function SelectInput({ className = "", children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={`px-5 py-4 bg-stone-50 border border-transparent rounded-2xl focus:bg-white focus:border-stone-900 focus:ring-1 focus:ring-stone-900 outline-none transition-all font-medium text-lg text-stone-700 appearance-none cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}