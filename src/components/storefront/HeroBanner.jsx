import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, PackageCheck, ShieldCheck, Sprout } from "lucide-react";
import { getHeroProducts } from "@/lib/catalog";
import ProductImage from "@/components/storefront/ProductImage";

const HeroBanner = ({ products = [] }) => {
  const [, sideOne, sideTwo] = useMemo(() => getHeroProducts(products), [products]);

  const trustItems = [
    { icon: Sprout, label: "Plant-powered care" },
    { icon: ShieldCheck, label: "Skin-first formulas" },
    { icon: PackageCheck, label: "Made for rituals" },
  ];

  return (
    <section className="relative overflow-hidden bg-[#F8DDE3]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(58rem_34rem_at_82%_8%,rgba(255,255,255,0.65),transparent_62%),radial-gradient(48rem_32rem_at_8%_80%,rgba(247,199,209,0.6),transparent_65%)]" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-20 top-1/3 h-80 w-80 rounded-full border border-white/40" aria-hidden="true" />

      <div className="container relative grid items-center gap-8 py-10 sm:py-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-6 lg:py-0">
        <div className="relative z-10 max-w-xl animate-fade-in lg:py-20">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-brand-rose-deep">
            New collection
          </p>
          <h1 className="mt-4 text-[48px] font-medium leading-[0.98] tracking-[-0.055em] text-brand-ink sm:text-[64px] lg:text-[76px]">
            Good Skin Days,
            <br />
            <span className="text-brand-rose-deep">On Repeat.</span>
          </h1>
          <p className="mt-5 max-w-md text-sm leading-6 text-brand-ink/65 sm:text-[15px]">
            Simple, skin-first formulas for cleansing, hydrating and protecting. Made to fit
            your day, not the other way around.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-4">
            <Link
              to="/#shop"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-brand-ink px-7 text-sm font-semibold text-white shadow-warm transition hover:-translate-y-0.5 hover:bg-brand-rose-deep"
            >
              Shop Skincare
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/#categories" className="group inline-flex items-center gap-3 text-xs font-semibold text-brand-ink">
              <span className="grid h-11 w-11 place-items-center rounded-full border border-brand-ink/20 bg-white/50 transition group-hover:bg-white">
                <ArrowUpRight className="h-4 w-4" />
              </span>
              Find Your Ritual
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3">
            {trustItems.map((item) => (
              <span key={item.label} className="inline-flex items-center gap-2 text-[10px] font-semibold text-brand-ink/60">
                <item.icon className="h-4 w-4 text-brand-rose-deep" />
                {item.label}
              </span>
            ))}
          </div>
        </div>

        <div className="relative h-[420px] sm:h-[500px] lg:h-[660px]">
          <div className="absolute bottom-14 right-[12%] h-16 w-[68%] rounded-[50%] bg-[#E9B9C4]/50 blur-2xl" aria-hidden="true" />
          <div className="absolute left-[8%] top-[12%] h-40 w-40 rounded-full bg-white/30 blur-2xl" aria-hidden="true" />

          <div className="absolute left-1/2 top-1/2 z-10 h-[340px] w-[265px] -translate-x-1/2 -translate-y-1/2 rotate-[-2deg] rounded-t-[160px] rounded-b-[30px] border border-white/60 bg-white/55 p-3 shadow-soft sm:h-[400px] sm:w-[315px] lg:h-[500px] lg:w-[390px]">
            <div className="h-full overflow-hidden rounded-t-[148px] rounded-b-[22px] bg-white/60">
              <img
                src="/images/hero-glow.jpg"
                alt="A woman with soft, luminous skin"
                loading="eager"
                className="h-full w-full object-cover object-center transition duration-700 hover:scale-[1.03]"
              />
            </div>
          </div>

          <div className="absolute right-3 top-4 z-20 grid h-[94px] w-[94px] place-items-center rounded-full border border-white/80 bg-white text-center shadow-soft sm:right-10 sm:top-10 sm:h-[110px] sm:w-[110px]">
            <div>
              <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-brand-rose-deep">New</p>
              <p className="mt-0.5 font-display text-xl font-semibold leading-none text-brand-ink sm:text-2xl">Collection</p>
              <p className="mt-1.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-brand-muted">
                {products.length || 8} essentials
              </p>
            </div>
          </div>

          {sideOne && (
            <div className="animate-float absolute bottom-3 left-0 z-20 hidden h-[125px] w-[145px] rotate-[-8deg] overflow-hidden rounded-[20px] border-[4px] border-white bg-white p-1.5 shadow-soft sm:block lg:bottom-10 lg:left-5" style={{ animationDelay: "1.2s" }}>
              <ProductImage src={sideOne.image} alt={sideOne.name} className="h-full w-full rounded-[12px]" />
            </div>
          )}
          {sideTwo && (
            <div className="animate-float absolute bottom-7 right-0 z-20 hidden h-[118px] w-[135px] rotate-[7deg] overflow-hidden rounded-[20px] border-[4px] border-white bg-white p-1.5 shadow-soft sm:block lg:bottom-16 lg:right-2" style={{ animationDelay: "0.5s" }}>
              <ProductImage src={sideTwo.image} alt={sideTwo.name} className="h-full w-full rounded-[12px]" />
            </div>
          )}

        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
