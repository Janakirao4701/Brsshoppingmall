"use client";

import Image from "next/image";
import { Link } from "@/i18n/routing";

const QUICK_CATS = [
  { name: "Sarees", href: "/women?category=saree", image: "/cat-saree.png" },
  { name: "Men's Ethnic", href: "/men?category=ethnic", image: "/cat-men-ethnic.png" },
  { name: "Western Wear", href: "/women?category=western", image: "/cat-women-western.png" },
  { name: "Formals", href: "/men?category=formal", image: "/cat-men-formal.png" },
  { name: "Kids", href: "/kids", image: "/cat-kids-new.png" },
];

export function QuickCategories() {
  return (
    <section className="py-12 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-start md:justify-center gap-6 md:gap-12 overflow-x-auto pb-4 hide-scrollbar snap-x snap-mandatory">
          {QUICK_CATS.map((cat) => (
            <Link 
              key={cat.name}
              href={cat.href as any}
              className="flex flex-col items-center gap-3 group snap-center min-w-[80px]"
            >
              <div className="relative size-16 md:size-24 rounded-full overflow-hidden border-2 border-transparent group-hover:border-brand-red transition-all duration-500 shadow-sm group-hover:shadow-xl">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-brand-red transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
