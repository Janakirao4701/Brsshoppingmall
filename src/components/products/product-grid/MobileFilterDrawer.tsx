"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  resultCount: number;
}

export function MobileFilterDrawer({
  isOpen,
  onClose,
  children,
  resultCount
}: MobileFilterDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] bg-white rounded-t-[32px] p-6 overflow-y-auto shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold text-slate-900">Filters</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full hover:bg-slate-100"
          >
            <X className="size-6 text-slate-500" />
          </Button>
        </div>
        
        <div className="pb-24">
          {children}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-slate-100">
          <Button
            className="w-full bg-brand-red hover:bg-brand-red/90 text-white py-6 text-base font-bold rounded-2xl shadow-lg shadow-brand-red/20 active:scale-95 transition-all"
            onClick={onClose}
          >
            Show {resultCount} Results
          </Button>
        </div>
      </div>
    </div>
  );
}
