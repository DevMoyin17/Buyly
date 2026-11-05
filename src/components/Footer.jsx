import { Link } from "react-router-dom";
import { Instagram, Mail } from "lucide-react";
import BrandLogo from "@/components/storefront/BrandLogo";
import { CONTACT_EMAIL } from "@/lib/config";

const shopLinks = [
  { label: "Shop All", to: "/#shop" },
  { label: "Bestsellers", to: "/#bestsellers" },
  { label: "Categories", to: "/#categories" },
  { label: "The Glowora Edit", to: "/#featured" },
];

const accountLinks = [
  { label: "Sign In", to: "/signin" },
  { label: "Create Account", to: "/auth" },
  { label: "Checkout", to: "/checkout" },
];

const Footer = () => {
  return (
    <footer className="mt-auto bg-white">
      <div className="border-t border-brand-line/80">
        <div className="container grid grid-cols-2 gap-x-6 gap-y-9 py-12 sm:grid-cols-2 lg:grid-cols-[1.35fr_0.8fr_0.8fr_1fr] lg:gap-8 lg:py-16">
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <BrandLogo />
            <p className="mt-5 max-w-xs text-sm leading-6 text-brand-muted">
              Skin-loving essentials for soft, luminous, everyday skin. Thoughtfully formulated,
              gently made and designed for your rituals.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noreferrer"
                className="grid h-9 w-9 place-items-center rounded-full border border-brand-line text-brand-muted transition hover:border-brand-ink/20 hover:bg-brand-peach hover:text-brand-ink"
                aria-label="Glowora on Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="grid h-9 w-9 place-items-center rounded-full border border-brand-line text-brand-muted transition hover:border-brand-ink/20 hover:bg-brand-peach hover:text-brand-ink"
                aria-label="Email Glowora"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-muted">Shop</h3>
            <ul className="mt-4 space-y-2.5">
              {shopLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm font-semibold text-brand-ink/75 transition hover:text-brand-tangerine"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-muted">Account</h3>
            <ul className="mt-4 space-y-2.5">
              {accountLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm font-semibold text-brand-ink/75 transition hover:text-brand-tangerine"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-muted">Contact</h3>
            <div className="mt-4 space-y-3 text-sm">
              <p className="font-semibold leading-6 text-brand-ink/75">
                Questions, sizing advice or order help?
              </p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex items-center gap-2 font-bold text-brand-ink transition hover:text-brand-tangerine"
              >
                <Mail className="h-4 w-4 text-brand-tangerine" />
                {CONTACT_EMAIL}
              </a>
              <p className="text-xs leading-5 text-brand-muted">
                Secure payments powered by Paystack. We never store your card details.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-brand-forest text-white">
        <div className="container flex flex-col gap-2 py-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Glowora. All rights reserved.</p>
          <p>Nourished skin, naturally.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
