import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { WhatsAppWidget } from "@/components/ui/WhatsAppWidget";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { getStorefrontSettings } from "@/lib/storefront-data";

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch announcement settings on the server (cached for 5 min)
  const settings = await getStorefrontSettings();

  return (
    <SmoothScroll>
      <Navbar announcementData={settings} />
      <main className="flex-1 pb-16 md:pb-0">
        {children}
      </main>
      <Footer />
      <MobileTabBar />
      <CartDrawer />
      <WhatsAppWidget />
    </SmoothScroll>
  );
}
