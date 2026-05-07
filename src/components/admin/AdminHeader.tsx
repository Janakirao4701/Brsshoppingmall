"use client";

import { Search, Bell } from "lucide-react";
import { usePathname } from "next/navigation";

export function AdminHeader() {
  const pathname = usePathname();
  const isLoginPage = pathname?.includes("/admin/login");

  if (isLoginPage) return null;

  return (
    <div className="flex-1 flex items-center justify-between">
      <div className="flex-1 max-w-md relative hidden sm:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888888] size-4" />
        <input 
          type="text" 
          placeholder="Search..." 
          className="w-full bg-[#fafafa] shadow-[0_0_0_1px_rgba(0,0,0,0.08)] text-sm rounded-md pl-10 pr-4 py-2 focus:outline-none focus:shadow-[0_0_0_2px_#171717] transition-shadow placeholder:text-[#888888]"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
          <kbd className="hidden md:inline-flex items-center justify-center rounded bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.08)] px-1.5 font-mono text-[10px] font-medium text-[#888888]">
            Ctrl
          </kbd>
          <kbd className="hidden md:inline-flex items-center justify-center rounded bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.08)] px-1.5 font-mono text-[10px] font-medium text-[#888888]">
            K
          </kbd>
        </div>
      </div>

      <div className="flex-1 sm:flex-none flex items-center justify-end gap-2">
        <button className="relative p-3 text-[#4d4d4d] hover:text-[#171717] transition-colors rounded-xl hover:bg-[#fafafa] min-w-[44px] min-h-[44px] flex items-center justify-center">
          <Bell className="size-5" />
          <span className="absolute top-3 right-3 size-2 bg-blue-500 rounded-full shadow-[0_0_0_2px_#ffffff]" />
        </button>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-purple-500 shadow-[0_0_0_1px_rgba(0,0,0,0.08)] p-[2px] cursor-pointer hover:opacity-90 transition-opacity flex items-center justify-center">
          <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center text-xs font-bold text-[#171717]">
            V
          </div>
        </div>
      </div>
    </div>
  );
}
