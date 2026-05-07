"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { 
  MapPin, 
  Phone, 
  Clock, 
  ExternalLink 
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function StoreLocator() {
  const t = useTranslations("Store");
  const [isIntersecting, setIsIntersecting] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" } // Load slightly before it comes into view
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const STORES = [
    {
      name: t("sompeta"),
      address: "Main Road, Sompeta, Srikakulam Dist, AP - 532284",
      phone: "+91 78293 33444",
      hours: "Daily: 9:00 AM – 9:00 PM",
      mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15119.529323789394!2d84.58474251738281!3d18.892200400000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a3d13543d4f5555%3A0x6d9f3f9f9f9f9f9f!2sSompeta%2C%20Andhra%20Pradesh!5e0!3m2!1sen!2sin!4v1714820000000!5m2!1sen!2sin",
      mapLink: "https://maps.google.com/?q=BSR+Shopping+Mall+Sompeta",
    },
    {
      name: t("palasa"),
      address: "NH-16, Palasa, Srikakulam Dist, AP - 532221",
      phone: "+91 78293 33444",
      hours: "Daily: 9:00 AM – 9:00 PM",
      mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3780.892834!2d84.417834!3d18.874834!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a3d1b543d4f5555%3A0x7d9f3f9f9f9f9f9f!2sPalasa%2C%20Andhra%20Pradesh!5e0!3m2!1sen!2sin!4v1714820000001!5m2!1sen!2sin",
      mapLink: "https://maps.google.com/?q=BSR+Shopping+Mall+Palasa",
    },
  ];

  return (
    <section ref={sectionRef} className="py-16 px-4 bg-slate-50">
      <div className="container mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-serif font-medium mb-4 tracking-tight text-slate-900">
            <span className="text-italic-accent">Visit</span> Our Stores
          </h2>
          <p className="text-section-subtitle text-muted-foreground max-w-2xl mx-auto">
            Experience our premium collection in person. Visit our branches in Sompeta and Palasa for the best readymade garments.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {STORES.map((store, index) => (
            <Card key={index} className="overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 rounded-none bg-white">
              <div className="aspect-video w-full bg-slate-100 animate-pulse flex items-center justify-center border-b border-slate-100">
                {isIntersecting ? (
                  <iframe
                    src={store.mapEmbed}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={store.name}
                    className="animate-in fade-in duration-500"
                  ></iframe>
                ) : (
                  <span className="text-slate-400 font-medium tracking-widest text-xs uppercase">Loading Map...</span>
                )}
              </div>
              <CardHeader className="p-6 md:p-8 pb-4">
                <CardTitle className="text-xl md:text-2xl font-serif font-medium text-slate-900">{store.name}</CardTitle>
                <CardDescription className="flex items-start mt-3 text-[13px] leading-relaxed text-slate-500">
                  <MapPin className="size-4 mr-3 mt-0.5 text-slate-400 shrink-0" strokeWidth={1.5} />
                  {store.address}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 md:p-8 pt-0 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between space-y-6 sm:space-y-0">
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-slate-600">
                      <Phone className="size-4 mr-3 text-slate-400" strokeWidth={1.5} />
                      <a href={`tel:${store.phone}`} className="hover:text-slate-900 transition-colors font-medium tracking-wide">
                        {store.phone}
                      </a>
                    </div>
                    <div className="flex items-center text-sm text-slate-500">
                      <Clock className="size-4 mr-3 text-slate-400" strokeWidth={1.5} />
                      {store.hours}
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    asChild 
                    className="border-slate-300 text-[11px] uppercase tracking-[0.15em] font-medium text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 rounded-none px-6"
                  >
                    <a href={store.mapLink} target="_blank" rel="noopener noreferrer">
                      {t("directions")} <ExternalLink className="size-3.5 ml-2" strokeWidth={1.5} />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
