"use client";

import { Truck, RotateCcw, Shield } from "lucide-react";

export function TrustBadges() {
  return (
    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100">
      <div className="text-center space-y-1">
        <Truck className="size-5 mx-auto text-brand-orange" />
        <p className="text-xs text-slate-600 font-medium">All India Delivery</p>
      </div>
      <div className="text-center space-y-1">
        <RotateCcw className="size-5 mx-auto text-brand-orange" />
        <p className="text-xs text-slate-600 font-medium">Easy Returns</p>
      </div>
      <div className="text-center space-y-1">
        <Shield className="size-5 mx-auto text-brand-orange" />
        <p className="text-xs text-slate-600 font-medium">100% Genuine</p>
      </div>
    </div>
  );
}
