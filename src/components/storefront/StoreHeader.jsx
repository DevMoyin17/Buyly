import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, Search, ShoppingBag, UserRound } from "lucide-react";
import { useStore } from "@/lib/store";
import { CONTACT_EMAIL } from "@/lib/config";
import BrandLogo from "@/components/storefront/BrandLogo";
import CurrencySelector from "@/components/CurrencySelector";
import CartDrawer from "@/components/CartDrawer";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

const navLinks = [
  { label: "Home", to: "/", hash: "" },
  { label: "Shop", to: "/#shop", hash: "#shop" },
  { label: "Categories", to: "/#categories", hash: "#categories" },
  { label: "Bestsellers", to: "/#bestsellers", hash: "#bestsellers" },
  { label: "Contact", contact: true },
];

const StoreHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const cart = useStore((state) => state.cart);
  const navigate = useNavigate();
  const location = useLocation();

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const isHome = location.pathname === "/" && !location.hash;

  const isActive = (link) => {
    if (link.hash) return location.pathname === "/" && location.hash === link.hash;
    return isHome;
  };

  const navClass = (active) =>
    [
      "relative py-2 text-[13px] font-medium transition duration-200",
      "after:absolute after:-bottom-[1px] after:left-0 after:h-[2px] after:w-full after:origin-left after:bg-brand-ink after:transition-transform after:duration-300",
      active
        ? "text-brand-ink after:scale-x-100"
        : "text-brand-ink/65 after:scale-x-0 hover:text-brand-ink",
    ].join(" ");

  const handleSearch = () => {
    const dispatch = () => {
      window.setTimeout(() => {
        window.dispatchEvent(new CustomEvent("glowora:focus-search"));
      }, 120);
    };

    if (location.pathname !== "/") {
      navigate("/#shop");
      window.setTimeout(dispatch, 320);
      return;
    }

    dispatch();
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-brand-line/80 bg-brand-cream/95 backdrop-blur-xl">
        <div className="container flex h-[82px] items-center gap-4">
          <BrandLogo className="shrink-0" />

          <nav className="ml-4 hidden flex-1 items-center justify-center gap-7 lg:flex" aria-label="Main navigation">
            {navLinks.map((link) =>
              link.contact ? (
                <a
                  key={link.label}
                  href={`mailto:${CONTACT_EMAIL}`}
                  className={navClass(false)}
                >
                  {link.label}
                </a>
              ) : (
                <Link key={link.label} to={link.to} className={navClass(isActive(link))}>
                  {link.label}
                </Link>
              ),
            )}
          </nav>

          <div className="ml-auto flex items-center gap-0.5 sm:gap-1">
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full text-brand-ink/75 transition hover:bg-brand-blush hover:text-brand-ink"
              onClick={handleSearch}
              aria-label="Search products"
            >
              <Search className="h-[18px] w-[18px]" />
            </button>

            <div className="hidden sm:block">
              <CurrencySelector className="h-10 w-[76px] border-transparent bg-transparent px-1 text-[10px] shadow-none hover:bg-brand-blush" />
            </div>

            <Link
              to="/signin"
              className="grid h-10 w-10 place-items-center rounded-full text-brand-ink/75 transition hover:bg-brand-blush hover:text-brand-ink"
              aria-label="Account"
            >
              <UserRound className="h-[18px] w-[18px]" />
            </Link>

            <button
              type="button"
              className="relative grid h-10 w-10 place-items-center rounded-full text-brand-ink/75 transition hover:bg-brand-blush hover:text-brand-ink"
              onClick={() => setCartOpen(true)}
              aria-label="Open shopping cart"
            >
              <ShoppingBag className="h-[18px] w-[18px]" />
              {cartCount > 0 && (
                <span className="absolute right-0.5 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-brand-rose px-1 text-[9px] font-extrabold text-white">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full text-brand-ink transition hover:bg-brand-blush lg:hidden"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="w-[90vw] max-w-sm p-0">
          <SheetTitle className="sr-only">Glowora navigation menu</SheetTitle>
          <div className="flex h-full flex-col bg-brand-cream">
            <div className="flex items-center border-b border-brand-line px-5 py-5 pr-14">
              <BrandLogo />
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-6">
              <p className="eyebrow mb-3">Explore</p>
              <nav className="space-y-1" aria-label="Mobile navigation">
                {navLinks.map((link) =>
                  link.contact ? (
                    <a
                      key={link.label}
                      href={`mailto:${CONTACT_EMAIL}`}
                      onClick={closeMenu}
                      className="block rounded-xl px-3 py-3 font-display text-2xl font-medium text-brand-ink transition hover:bg-brand-blush"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={link.label}
                      to={link.to}
                      onClick={closeMenu}
                      className="block rounded-xl px-3 py-3 font-display text-2xl font-medium text-brand-ink transition hover:bg-brand-blush"
                    >
                      {link.label}
                    </Link>
                  ),
                )}
              </nav>

              <div className="mt-6 rounded-2xl border border-brand-line bg-white p-4">
                <p className="eyebrow mb-2">Currency</p>
                <CurrencySelector className="h-10 w-full border-brand-line bg-white" />
              </div>

              <div className="mt-5 rounded-2xl bg-brand-blush p-4">
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-brand-rose-deep">
                  Need a hand?
                </p>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="mt-2 block font-display text-xl font-medium text-brand-ink transition hover:text-brand-rose-deep"
                >
                  {CONTACT_EMAIL}
                </a>
                <p className="mt-2 text-xs leading-5 text-brand-muted">
                  We are here to help with orders, sizing and product questions.
                </p>
              </div>
            </div>

            <div className="border-t border-brand-line px-5 py-5">
              <div className="flex items-center gap-4 text-xs font-semibold text-brand-muted">
                <Link to="/signin" onClick={closeMenu} className="hover:text-brand-ink">
                  Sign in
                </Link>
                <span className="h-1 w-1 rounded-full bg-brand-line" />
                <Link to="/auth" onClick={closeMenu} className="hover:text-brand-ink">
                  Create account
                </Link>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default StoreHeader;
