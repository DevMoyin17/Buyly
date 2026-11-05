import { Link } from "react-router-dom";
import { Check, Flower2, Sparkles } from "lucide-react";
import BrandLogo from "@/components/storefront/BrandLogo";

const AuthShell = ({ eyebrow, title, description, children, footer }) => {
  return (
    <div className="container animate-fade-soft py-8 sm:py-12 lg:py-16">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-[30px] border border-brand-line bg-white shadow-soft lg:grid-cols-[0.88fr_1.12fr]">
        <aside className="relative hidden overflow-hidden bg-[#F8DFE4] p-9 lg:flex lg:flex-col lg:justify-between xl:p-11">
          <Flower2
            className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 text-brand-rose/30"
            strokeWidth={0.55}
            aria-hidden="true"
          />
          <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-white/40 blur-3xl" aria-hidden="true" />

          <BrandLogo />

          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-rose/25 bg-white/50 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-brand-rose-deep">
              <Sparkles className="h-3 w-3" />
              The Glowora edit
            </span>
            <h2 className="mt-5 font-display text-[40px] font-medium leading-[1.02] tracking-[-0.04em] text-brand-ink">
              A little more
              <br />
              beautiful, <span className="text-brand-rose-deep">every day.</span>
            </h2>
            <p className="mt-4 max-w-xs text-sm leading-6 text-brand-ink/60">
              One account for your wishlist, order history and a softer, faster checkout when you find the good stuff.
            </p>

            <ul className="mt-6 space-y-3">
              {["Save your favourite formulas", "Check out faster next time", "Keep your Glowora orders together"].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-xs font-semibold text-brand-ink/70">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-brand-rose/15 text-brand-rose-deep">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <p className="font-display text-sm italic text-brand-ink/40">Nourished skin, naturally.</p>
        </aside>

        <div className="p-6 sm:p-10 lg:p-12">
          <div className="mb-7">
            <p className="eyebrow">{eyebrow}</p>
            <h1 className="mt-2 font-display text-[34px] font-medium tracking-[-0.04em] text-brand-ink sm:text-[40px]">
              {title}
            </h1>
            <p className="mt-2 text-sm leading-6 text-brand-muted">{description}</p>
          </div>
          {children}
          {footer && <div className="mt-6 border-t border-brand-line pt-5 text-center text-xs text-brand-muted">{footer}</div>}
        </div>
      </div>

      <p className="mt-5 text-center text-xs text-brand-muted">
        <Link to="/" className="font-semibold text-brand-ink transition hover:text-brand-rose-deep">
          ← Back to the shop
        </Link>
      </p>
    </div>
  );
};

export default AuthShell;
