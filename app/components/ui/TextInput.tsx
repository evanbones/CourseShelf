import type { InputHTMLAttributes } from "react";

export function TextInput({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`px-5 py-4 bg-stone-50 border border-transparent rounded-2xl focus:bg-white focus:border-stone-900 focus:ring-1 focus:ring-stone-900 outline-none transition-all placeholder-stone-400 font-medium text-lg ${className}`}
      {...props}
    />
  );
}