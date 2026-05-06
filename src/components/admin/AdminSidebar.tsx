"use client";

import { Link, usePathname, useRouter } from "@/i18n/routing";
import { supabase } from "@/lib/supabase";
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Settings, 
  ShoppingCart,
  Inbox,
  LogOut,
  Image as ImageIcon,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname?.includes("/admin/login");

  if (isLoginPage) return null;

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/admin/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <aside className="w-[280px] flex-shrink-0 flex flex-col h-screen sticky top-0 bg-white border-r border-slate-100 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-30">
      {/* Header */}
      <div className="h-20 flex-shrink-0 flex items-center px-8 border-b border-slate-50">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="font-bold text-slate-900 text-lg leading-none tracking-tight">Admin Console</span>
            <span className="text-[10px] font-bold text-brand-red uppercase tracking-[0.2em] mt-1.5">BSR Shopping Mall</span>
          </div>
        </Link>
      </div>

      {/* Navigation - Scrollable area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide">
        <div className="space-y-8">
          <div>
            <p className="px-4 text-[10px] font-bold text-slate-400 mb-4 uppercase tracking-[0.2em]">General</p>
            <div className="space-y-1">
              <NavItem href="/admin" icon={<LayoutDashboard size={18} />} label="Dashboard" pathname={pathname} />
              <NavItem href="/admin/analytics" icon={<ExternalLink size={18} />} label="Advanced Analytics" pathname={pathname} />
            </div>
          </div>

          <div>
            <p className="px-4 text-[10px] font-bold text-slate-400 mb-4 uppercase tracking-[0.2em]">Inventory</p>
            <div className="space-y-1">
              <NavItem href="/admin/products" icon={<Package size={18} />} label="Products" pathname={pathname} />
              <NavItem href="/admin/categories" icon={<LayoutDashboard size={18} />} label="Categories" pathname={pathname} />
              <NavItem href="/admin/brands" icon={<Shield size={18} />} label="Brands & Vendors" pathname={pathname} />
              <NavItem href="/admin/banners" icon={<ImageIcon size={18} />} label="Hero Banners" pathname={pathname} />
            </div>
          </div>

          <div>
            <p className="px-4 text-[10px] font-bold text-slate-400 mb-4 uppercase tracking-[0.2em]">Sales & Marketing</p>
            <div className="space-y-1">
              <NavItem href="/admin/orders" icon={<ShoppingCart size={18} />} label="Orders" pathname={pathname} />
              <NavItem href="/admin/customers" icon={<Users size={18} />} label="Customers" pathname={pathname} />
              <NavItem href="/admin/coupons" icon={<Shield size={18} />} label="Coupons & Offers" pathname={pathname} />
              <NavItem href="/admin/inquiries" icon={<Inbox size={18} />} label="Bulk Inquiries" pathname={pathname} />
            </div>
          </div>

          <div>
            <p className="px-4 text-[10px] font-bold text-slate-400 mb-4 uppercase tracking-[0.2em]">Config</p>
            <div className="space-y-1">
              <NavItem href="/admin/settings" icon={<Settings size={18} />} label="System Settings" pathname={pathname} />
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Fixed at bottom */}
      <div className="p-4 space-y-2 border-t border-slate-50 bg-white mt-auto">
        <Link 
          href="/" 
          className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-slate-600 hover:text-brand-red hover:bg-brand-red/5 rounded-xl transition-all group"
        >
          <div className="flex items-center gap-3">
            <ExternalLink size={18} />
            Back to Website
          </div>
          <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
        
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-sm font-bold text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

function NavItem({ 
  href, 
  icon, 
  label, 
  pathname, 
  badge 
}: { 
  href: string; 
  icon: React.ReactNode; 
  label: string; 
  pathname: string; 
  badge?: string 
}) {
  const isActive = pathname === href || (href !== "/admin" && pathname.startsWith(href));

  return (
    <Link 
      href={href}
      className={cn(
        "flex items-center justify-between px-4 py-3 text-sm rounded-xl transition-all duration-200 group",
        isActive 
          ? "bg-slate-900 text-white font-semibold shadow-lg shadow-slate-200" 
          : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
      )}
    >
      <div className="flex items-center gap-3">
        <span className={cn(
          "transition-colors duration-200",
          isActive ? "text-white" : "text-slate-400 group-hover:text-slate-900"
        )}>
          {icon}
        </span>
        {label}
      </div>
      {badge && (
        <span className={cn(
          "px-2 py-0.5 text-[10px] font-bold rounded-full",
          isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
        )}>
          {badge}
        </span>
      )}
    </Link>
  );
}
