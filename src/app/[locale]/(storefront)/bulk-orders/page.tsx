import { BulkOrderForm } from "@/components/products/BulkOrderForm";
import { setRequestLocale } from "next-intl/server";
import { Package, Phone, MessageCircle } from "lucide-react";

export default async function BulkOrdersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="py-12 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-brand-orange bg-brand-orange/10 px-3 py-1 rounded-full mb-4">
            <Package className="size-4" /> Bulk Orders
          </div>
          <h1 className="text-3xl md:text-4xl font-heading font-normal text-slate-900 mb-4">
            Bulk Order Inquiry
          </h1>
          <p className="text-slate-600 text-lg leading-relaxed">
            Planning a large order for your business, event, or institution? BSR Shopping Mall 
            offers special pricing for bulk purchases. Fill out the form below and our team 
            will get back to you within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form */}
          <div className="lg:col-span-2">
            <BulkOrderForm />
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="bg-slate-50 rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-slate-900">Why Bulk Order with BSR?</h3>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-brand-red font-bold">✓</span>
                  Special wholesale pricing for 10+ pieces
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-red font-bold">✓</span>
                  Customization options available
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-red font-bold">✓</span>
                  All India delivery with bulk shipping rates
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-red font-bold">✓</span>
                  Dedicated account manager for large orders
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-red font-bold">✓</span>
                  Quality guarantee on all products
                </li>
              </ul>
            </div>

            <div className="bg-brand-red/5 rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-slate-900">Prefer to talk?</h3>
              <div className="space-y-3">
                <a
                  href="tel:+917829333444"
                  className="flex items-center gap-3 text-sm text-slate-700 hover:text-brand-red transition-colors"
                >
                  <Phone className="size-4" /> +91 78293 33444
                </a>
                <a
                  href={`https://wa.me/917829333444?text=${encodeURIComponent("Hi, I'd like to discuss a bulk order.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-green-600 hover:text-green-700 transition-colors"
                >
                  <MessageCircle className="size-4" /> Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
