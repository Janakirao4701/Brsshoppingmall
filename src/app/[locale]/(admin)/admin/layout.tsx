"use client";

import * as React from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-[#fafafa]">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block sticky top-0 h-screen">
          <AdminSidebar />
        </div>

        {/* Mobile Sidebar (Drawer) */}
        <div className="lg:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent side="left" className="p-0 w-[280px] border-none">
              <AdminSidebar className="w-full h-full" onMobileClose={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b bg-white px-4 lg:px-8">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setOpen(true)}
            >
              <Menu className="size-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
            <div className="flex-1">
              <AdminHeader />
            </div>
          </header>

          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}
