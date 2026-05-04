"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Settings, 
  ShoppingCart,
  Inbox,
  LogOut,
  Image as ImageIcon
} from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[240px] flex-shrink-0 flex flex-col h-screen sticky top-0 bg-[#fafafa] shadow-[1px_0_0_0_rgba(0,0,0,0.08)]">
      <div className="h-16 flex items-center px-6 shadow-[0_1px_0_0_rgba(0,0,0,0.08)]">
        <Link href="/" className="font-bold text-[#171717] flex items-center gap-2">
          <div className="w-6 h-6 bg-[#171717] rounded flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-sm" />
          </div>
          BSR Admin
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1 mb-8">
          <p className="px-3 text-xs font-semibold text-[#888888] mb-2 uppercase tracking-wider">Overview</p>
          <NavItem href="/admin" icon={<LayoutDashboard size={18} />} label="Dashboard" pathname={pathname} />
          <NavItem href="/admin/inquiries" icon={<Inbox size={18} />} label="Bulk Inquiries" pathname={pathname} />
        </div>

        <div className="space-y-1 mb-8">
          <p className="px-3 text-xs font-semibold text-[#888888] mb-2 uppercase tracking-wider">Store</p>
          <NavItem href="/admin/products" icon={<Package size={18} />} label="Products" pathname={pathname} />
          <NavItem href="/admin/banners" icon={<ImageIcon size={18} />} label="Hero Banners" pathname={pathname} />
          <NavItem href="/admin/orders" icon={<ShoppingCart size={18} />} label="Orders" pathname={pathname} />
          <NavItem href="/admin/customers" icon={<Users size={18} />} label="Customers" pathname={pathname} />
        </div>

        <div className="space-y-1">
          <p className="px-3 text-xs font-semibold text-[#888888] mb-2 uppercase tracking-wider">System</p>
          <NavItem href="/admin/settings" icon={<Settings size={18} />} label="Settings" pathname={pathname} />
        </div>
      </div>

      <div className="p-4 shadow-[0_-1px_0_0_rgba(0,0,0,0.08)]">
        <button className="flex items-center gap-3 w-full px-3 py-2 text-sm text-[#4d4d4d] hover:text-[#171717] hover:bg-black/5 rounded-md transition-colors">
          <LogOut size={18} />
          Log out
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
  // Extract locale from pathname (e.g., /en/admin -> /admin)
  const normalizedPathname = pathname.replace(/^\/[a-z]{2}/, "") || "/";
  const isActive = normalizedPathname === href || (href !== "/admin" && normalizedPathname.startsWith(href));

  return (
    <Link 
      href={href}
      className={`flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors ${
        isActive 
          ? "bg-black/5 text-[#171717] font-medium" 
          : "text-[#4d4d4d] hover:text-[#171717] hover:bg-black/5"
      }`}
    >
      <div className="flex items-center gap-3">
        {icon}
        {label}
      </div>
      {badge && (
        <span className="px-2 py-0.5 text-[10px] font-semibold bg-[#171717] text-white rounded-full">
          {badge}
        </span>
      )}
    </Link>
  );
}
