"use client";

import { motion, Variants } from "framer-motion";
import { Award, Truck, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const FEATURES = [
  {
    icon: Award,
    title: "Trusted Quality",
    titleItalic: "Quality",
    description: "Serving our community for over 20 years with premium readymade garments from top-tier national brands.",
  },
  {
    icon: Truck,
    title: "Pan-India Delivery",
    titleItalic: "Delivery",
    description: "Express shipping options delivering our selected boutique collections safely straight to your doorstep.",
  },
  {
    icon: ShieldCheck,
    title: "Dedicated Service",
    titleItalic: "Service",
    description: "Personalized premium assistance for retail & bulk orders via WhatsApp or call to meet your custom needs.",
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants: Variants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

export function WhyBSR() {
  return (
    <section className="py-16 md:py-24 px-4 bg-slate-50/50 border-t border-slate-100 overflow-hidden">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-medium text-slate-900 tracking-tight mb-3">
            Why <span className="text-italic-accent">BSR</span>
          </h2>
          <p className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-slate-400 font-medium">
            The BSR Boutique Experience
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
        >
          {FEATURES.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group"
              >
                <Card className="h-full border border-slate-100 bg-white shadow-xs hover:shadow-md hover:border-slate-200 transition-all duration-300 rounded-lg overflow-hidden">
                  <CardContent className="p-6 md:p-8 flex flex-col items-center text-center space-y-5 h-full justify-between">
                    <div className="relative">
                      {/* Decorative backdrop glow */}
                      <div className="absolute inset-0 bg-brand-orange/5 rounded-full blur-md scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      <div className="relative size-12 rounded-full border border-slate-100 bg-slate-50 flex items-center justify-center text-slate-700 group-hover:border-brand-red group-hover:text-brand-red transition-all duration-500">
                        <Icon className="size-5 transition-transform duration-500 group-hover:scale-110" strokeWidth={1.25} />
                      </div>
                    </div>

                    <div className="space-y-2 flex-grow">
                      <h3 className="text-base font-serif font-semibold text-slate-900">
                        {item.title.split(" ").map((word, i) => (
                          <span key={i}>
                            {word === item.titleItalic ? (
                              <span className="text-italic-accent font-medium text-brand-red ml-1">{word}</span>
                            ) : (
                              word
                            )}{" "}
                          </span>
                        ))}
                      </h3>
                      <p className="text-slate-500 text-xs md:text-[13px] leading-relaxed max-w-xs mx-auto">
                        {item.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
