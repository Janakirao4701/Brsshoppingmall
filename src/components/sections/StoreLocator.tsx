"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, 
  Phone, 
  Clock, 
  ExternalLink,
  Map
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function StoreLocator() {
  const t = useTranslations("Store");
  const [activeTab, setActiveTab] = useState(0);
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
      { rootMargin: "200px" }
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
    <section ref={sectionRef} className="py-16 px-4 bg-white border-t border-slate-100 overflow-hidden">
      <div className="container mx-auto max-w-5xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-medium mb-3 tracking-tight text-slate-900">
            <span className="text-italic-accent">Visit</span> Our Stores
          </h2>
          <p className="text-slate-500 text-xs md:text-sm max-w-xl mx-auto leading-relaxed">
            Experience our premium collection in person at Sompeta or Palasa.
          </p>
        </motion.div>

        {/* Custom Tab Switcher */}
        <div className="flex justify-center mb-8">
          <div className="relative flex p-1 bg-slate-100/80 rounded-full border border-slate-200/50 backdrop-blur-xs">
            {STORES.map((store, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`relative px-6 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors duration-300 z-10 ${
                  activeTab === index ? "text-white" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {store.name}
                {activeTab === index && (
                  <motion.div
                    layoutId="activeStoreTab"
                    className="absolute inset-0 bg-brand-red rounded-full -z-10 shadow-sm"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Main Grid: Details + Map */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          
          {/* Details Column */}
          <div className="md:col-span-5 flex flex-col justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                <Card className="h-full border border-slate-100 bg-slate-50/50 flex flex-col justify-between p-6 rounded-xl shadow-xs">
                  <div className="space-y-6">
                    <CardHeader className="p-0">
                      <div className="inline-flex size-10 rounded-full bg-brand-red/5 text-brand-red items-center justify-center mb-3">
                        <Map className="size-5" strokeWidth={1.5} />
                      </div>
                      <CardTitle className="text-xl md:text-2xl font-serif font-semibold text-slate-900">
                        {STORES[activeTab].name} Branch
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="p-0 space-y-4">
                      <div className="flex items-start text-slate-600 text-xs md:text-[13px] leading-relaxed">
                        <MapPin className="size-4 mr-3 mt-0.5 text-brand-red shrink-0" strokeWidth={1.5} />
                        <span>{STORES[activeTab].address}</span>
                      </div>

                      <div className="flex items-center text-slate-600 text-xs md:text-sm">
                        <Phone className="size-4 mr-3 text-slate-400 shrink-0" strokeWidth={1.5} />
                        <a href={`tel:${STORES[activeTab].phone}`} className="hover:text-brand-red transition-colors font-medium">
                          {STORES[activeTab].phone}
                        </a>
                      </div>

                      <div className="flex items-center text-slate-500 text-xs md:text-sm">
                        <Clock className="size-4 mr-3 text-slate-400 shrink-0" strokeWidth={1.5} />
                        <span>{STORES[activeTab].hours}</span>
                      </div>
                    </CardContent>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-200/60">
                    <Button 
                      asChild 
                      className="w-full bg-brand-red hover:bg-brand-red-dark text-white rounded-lg py-5 text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
                    >
                      <a href={STORES[activeTab].mapLink} target="_blank" rel="noopener noreferrer">
                        {t("directions")} <ExternalLink className="size-3.5 ml-2" strokeWidth={2} />
                      </a>
                    </Button>
                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Map Column */}
          <div className="md:col-span-7 h-[300px] md:h-auto min-h-[350px] relative rounded-xl overflow-hidden border border-slate-100 shadow-xs bg-slate-100 flex items-center justify-center">
            {isIntersecting ? (
              <iframe
                src={STORES[activeTab].mapEmbed}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={STORES[activeTab].name}
                className="absolute inset-0 w-full h-full"
              ></iframe>
            ) : (
              <span className="text-slate-400 font-semibold tracking-wider text-xs uppercase">
                Loading Map...
              </span>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
