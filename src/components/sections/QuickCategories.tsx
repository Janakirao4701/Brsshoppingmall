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
    <section className="py-12 md:py-16 bg-white overflow-hidden border-b border-slate-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-start md:justify-center gap-6 md:gap-16 overflow-x-auto pb-4 md:pb-0 hide-scrollbar snap-x snap-mandatory">
          {QUICK_CATS.map((cat) => (
            <Link 
              key={cat.name}
              href={cat.href as any}
              className="flex flex-col items-center gap-4 group snap-center min-w-[80px]"
            >
              <div className="relative size-20 md:size-28 rounded-full overflow-hidden border border-slate-200 group-hover:border-slate-900 transition-colors duration-500">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 80px, 112px"
                />
              </div>
              <span className="text-[10px] md:text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500 group-hover:text-slate-900 transition-colors duration-300">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
