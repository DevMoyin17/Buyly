import { Link } from "react-router-dom";
import { ArrowRight, Flower2, Sparkles } from "lucide-react";
import ProductImage from "@/components/storefront/ProductImage";
import Reveal from "@/components/storefront/Reveal";

const FeaturedDeal = ({ product, productCount = 0, categoryCount = 0 }) => {
  if (!product) return null;

  return (
    <section id="featured" className="store-section container">
      <Reveal>
        <div className="relative overflow-hidden rounded-[26px] bg-[#F8E1E6] px-6 py-8 sm:px-9 lg:px-12 lg:py-12">
        <Flower2
          className="pointer-events-none absolute -right-10 -top-14 h-56 w-56 text-brand-rose/20"
          strokeWidth={0.6}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-white/40 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative grid gap-8 lg:grid-cols-[0.9fr_0.8fr_0.42fr] lg:items-center">
          <div className="max-w-md">
            <p className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-rose-deep">
              <Sparkles className="h-3.5 w-3.5" />
              The Glowora edit
            </p>
            <h2 className="mt-4 text-[38px] font-medium leading-[0.98] text-brand-ink sm:text-[48px]">
              A Little Care,
              <br />
              <span className="text-brand-rose-deep">Every Single Day.</span>
            </h2>
            <p className="mt-4 text-sm leading-6 text-brand-ink/65">
              Cleanse, hydrate and protect with a simple edit of everyday essentials. No
              complicated routines, just skin that feels looked after.
            </p>
            <Link
              to={`/product/${product.id}`}
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-brand-ink px-6 text-xs font-semibold text-white shadow-warm transition hover:-translate-y-0.5 hover:bg-brand-rose-deep"
            >
              Shop the Set
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="relative flex min-h-[260px] items-center justify-center">
            <div className="absolute bottom-4 h-20 w-[76%] rounded-[50%] bg-[#E8B7C1]/40 blur-2xl" aria-hidden="true" />
            <div className="relative w-full max-w-[360px] rotate-[2deg] overflow-hidden rounded-[24px] border-[6px] border-white/70 bg-white p-2 shadow-soft">
              <ProductImage
                src={product.image}
                alt={product.name}
                className="aspect-[4/3] w-full rounded-[16px]"
                imageClassName="transition duration-700 hover:scale-105"
              />
              <div className="px-2 pb-2 pt-3 text-center">
                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-brand-muted">
                  Featured find
                </p>
                <p className="mt-1 truncate font-display text-xl font-medium text-brand-ink">{product.name}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-brand-rose/15 pt-5 lg:grid-cols-1 lg:gap-6 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
            <div>
              <p className="font-display text-4xl font-medium text-brand-rose-deep">{productCount}</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-brand-ink/50">
                Curated formulas
              </p>
            </div>
            <div>
              <p className="font-display text-4xl font-medium text-brand-rose-deep">{categoryCount}</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-brand-ink/50">
                Collections
              </p>
            </div>
          </div>
        </div>
        </div>
      </Reveal>
    </section>
  );
};

export default FeaturedDeal;
