import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, LockKeyhole, ShieldCheck, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { PaystackButton } from "react-paystack";
import { useStore } from "@/lib/store";
import { useAuthStore } from "@/lib/auth";
import { formatMoney } from "@/lib/format";
import { getProductCategory } from "@/lib/catalog";
import ProductImage from "@/components/storefront/ProductImage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SHIPPING_STORAGE_KEY = "glowora:shipping-address";

const createEmptyShipping = (user) => ({
  fullName: user?.name || "",
  phone: "",
  address: "",
  apartment: "",
  city: "",
  state: "",
  postalCode: "",
  country: "Nigeria",
});

const readSavedShipping = (user) => {
  if (typeof window === "undefined") return createEmptyShipping(user);
  try {
    const saved = JSON.parse(window.localStorage.getItem(SHIPPING_STORAGE_KEY));
    if (saved && typeof saved === "object") {
      return { ...createEmptyShipping(user), ...saved };
    }
  } catch {
    // Ignore malformed saved addresses.
  }
  return createEmptyShipping(user);
};

const REQUIRED_SHIPPING_FIELDS = ["fullName", "phone", "address", "city", "state", "country"];
const isPhoneValid = (value) => /^[+\d][\d\s()-]{6,}$/.test(value.trim());

const Checkout = () => {
  const cart = useStore((state) => state.cart);
  const clearCart = useStore((state) => state.clearCart);
  const addOrder = useStore((state) => state.addOrder);
  const currency = useStore((state) => state.currency);
  const exchangeRates = useStore((state) => state.exchangeRates);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const [email, setEmail] = useState(user?.email || "");
  const [shipping, setShipping] = useState(() => readSavedShipping(user));
  const [shippingTouched, setShippingTouched] = useState(false);
  const [paying, setPaying] = useState(false);

  const totalUSD = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const nairaRate = Number(exchangeRates?.NGN) || null;
  const ratesReady = Boolean(nairaRate);

  const getNairaAmount = () => {
    if (!nairaRate) return 0;
    return Math.round(totalUSD * nairaRate * 100);
  };

  const isEmailValid = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const emailValid = isEmailValid(email.trim());

  const shippingComplete =
    REQUIRED_SHIPPING_FIELDS.every((field) => shipping[field].trim().length > 0) &&
    isPhoneValid(shipping.phone);

  const updateShipping = (field) => (event) => {
    const value = event.target.value;
    setShipping((current) => ({ ...current, [field]: value }));
  };

  const getShippingAddress = () => ({
    fullName: shipping.fullName.trim(),
    phone: shipping.phone.trim(),
    address: shipping.address.trim(),
    apartment: shipping.apartment.trim(),
    city: shipping.city.trim(),
    state: shipping.state.trim(),
    postalCode: shipping.postalCode.trim(),
    country: shipping.country.trim(),
  });

  const componentProps = {
    email: email.trim(),
    amount: getNairaAmount(),
    publicKey: "pk_test_7b8262d43e0a09b78424edeb360ff0aea56529f2",
    text: "Pay securely with Paystack",
    onSuccess: async (transaction) => {
      try {
        setPaying(true);
        const shippingAddress = getShippingAddress();
        window.localStorage.setItem(SHIPPING_STORAGE_KEY, JSON.stringify(shippingAddress));
        await addOrder({
          items: cart,
          total: totalUSD,
          paymentReference: transaction.reference,
          status: "success",
          date: new Date().toISOString(),
          email: email.trim(),
          shipping: shippingAddress,
        });
        clearCart();
        toast.success("Payment successful. Your order is on its way.");
        navigate("/");
      } catch {
        toast.error("Payment succeeded but the order could not be saved. Please contact support.");
      } finally {
        setPaying(false);
      }
    },
    onClose: () => {
      addOrder({
        items: cart,
        total: totalUSD,
        status: "failed",
        date: new Date().toISOString(),
        email: email.trim(),
        shipping: getShippingAddress(),
      }).catch(() => {});
      toast.error("Payment was not completed.");
    },
  };

  // The checkout route is guarded, but keep payment unreachable without an account.
  if (!user) {
    return null;
  }

  if (cart.length === 0) {
    return (
      <div className="container py-16 sm:py-24">
        <div className="store-panel mx-auto flex max-w-lg flex-col items-center px-6 py-16 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-brand-peach text-brand-tangerine">
            <ShoppingBag className="h-7 w-7" />
          </span>
          <h1 className="mt-5 text-3xl font-extrabold">Your bag is empty</h1>
          <p className="mt-2 max-w-xs text-sm leading-6 text-brand-muted">
            Add a few favourites to your bag before heading to checkout.
          </p>
          <Button asChild className="mt-6">
            <Link to="/#shop">
              <ArrowLeft className="h-4 w-4" />
              Back to the shop
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container animate-fade-soft py-7 sm:py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Secure checkout</p>
          <h1 className="mt-1 font-display text-[40px] font-medium leading-none tracking-[-0.04em] sm:text-5xl">
            Almost yours.
          </h1>
          <p className="mt-2 text-sm text-brand-muted">
            Review your order and complete payment securely with Paystack.
          </p>
        </div>
        <Link to="/#shop" className="link-arrow">
          <ArrowLeft className="h-4 w-4" />
          Continue shopping
        </Link>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_400px] lg:items-start">
        <div className="space-y-4">
          <section className="store-panel p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-peach text-brand-tangerine">
                <span className="text-sm font-extrabold">01</span>
              </span>
              <div>
                <h2 className="text-lg font-semibold">Contact information</h2>
                <p className="mt-1 text-xs text-brand-muted">
                  We will send your order confirmation and delivery updates here.
                </p>
              </div>
            </div>
            <div className="mt-5 max-w-md">
              <label htmlFor="checkout-email" className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-brand-muted">
                Email address
              </label>
              <Input
                id="checkout-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2"
                placeholder="you@example.com"
                autoComplete="email"
              />
              {!isEmailValid(email.trim()) && email.trim().length > 0 && (
                <p className="field-error mt-1.5">Enter a valid email address to continue.</p>
              )}
              <p className="mt-2 text-[10px] leading-5 text-brand-muted">
                Signed in as <span className="font-semibold text-brand-ink">{user.name}</span>. Order
                updates will be sent to this email.
              </p>
            </div>
          </section>

          <section className="store-panel p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-peach text-brand-tangerine">
                <span className="text-sm font-extrabold">02</span>
              </span>
              <div>
                <h2 className="text-lg font-semibold">Shipping address</h2>
                <p className="mt-1 text-xs text-brand-muted">
                  Tell us where your order should be delivered.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="shipping-name" className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-brand-muted">
                  Full name <span className="text-brand-rose-deep">*</span>
                </label>
                <Input
                  id="shipping-name"
                  value={shipping.fullName}
                  onChange={updateShipping("fullName")}
                  onBlur={() => setShippingTouched(true)}
                  className="mt-2"
                  placeholder="Your full name"
                  autoComplete="name"
                />
              </div>

              <div>
                <label htmlFor="shipping-phone" className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-brand-muted">
                  Phone number <span className="text-brand-rose-deep">*</span>
                </label>
                <Input
                  id="shipping-phone"
                  type="tel"
                  value={shipping.phone}
                  onChange={updateShipping("phone")}
                  onBlur={() => setShippingTouched(true)}
                  className="mt-2"
                  placeholder="+234 800 000 0000"
                  autoComplete="tel"
                />
                {shippingTouched && shipping.phone.trim().length > 0 && !isPhoneValid(shipping.phone) && (
                  <p className="field-error mt-1.5">Enter a valid phone number.</p>
                )}
              </div>

              <div>
                <label htmlFor="shipping-country" className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-brand-muted">
                  Country <span className="text-brand-rose-deep">*</span>
                </label>
                <Input
                  id="shipping-country"
                  value={shipping.country}
                  onChange={updateShipping("country")}
                  onBlur={() => setShippingTouched(true)}
                  className="mt-2"
                  placeholder="Nigeria"
                  autoComplete="country-name"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="shipping-address" className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-brand-muted">
                  Street address <span className="text-brand-rose-deep">*</span>
                </label>
                <Input
                  id="shipping-address"
                  value={shipping.address}
                  onChange={updateShipping("address")}
                  onBlur={() => setShippingTouched(true)}
                  className="mt-2"
                  placeholder="House number and street name"
                  autoComplete="street-address"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="shipping-apartment" className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-brand-muted">
                  Apartment, suite, etc.{" "}
                  <span className="font-semibold normal-case tracking-normal text-brand-muted">
                    (optional)
                  </span>
                </label>
                <Input
                  id="shipping-apartment"
                  value={shipping.apartment}
                  onChange={updateShipping("apartment")}
                  className="mt-2"
                  placeholder="Apartment, suite, unit, building"
                  autoComplete="address-line2"
                />
              </div>

              <div>
                <label htmlFor="shipping-city" className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-brand-muted">
                  City <span className="text-brand-rose-deep">*</span>
                </label>
                <Input
                  id="shipping-city"
                  value={shipping.city}
                  onChange={updateShipping("city")}
                  onBlur={() => setShippingTouched(true)}
                  className="mt-2"
                  placeholder="City"
                  autoComplete="address-level2"
                />
              </div>

              <div>
                <label htmlFor="shipping-state" className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-brand-muted">
                  State / Region <span className="text-brand-rose-deep">*</span>
                </label>
                <Input
                  id="shipping-state"
                  value={shipping.state}
                  onChange={updateShipping("state")}
                  onBlur={() => setShippingTouched(true)}
                  className="mt-2"
                  placeholder="State or region"
                  autoComplete="address-level1"
                />
              </div>

              <div>
                <label htmlFor="shipping-postal" className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-brand-muted">
                  Postal code{" "}
                  <span className="font-semibold normal-case tracking-normal text-brand-muted">
                    (optional)
                  </span>
                </label>
                <Input
                  id="shipping-postal"
                  value={shipping.postalCode}
                  onChange={updateShipping("postalCode")}
                  className="mt-2"
                  placeholder="Postal code"
                  autoComplete="postal-code"
                />
              </div>
            </div>

            {shippingTouched && !shippingComplete && (
              <p className="field-error mt-3">
                Please complete all required shipping details.
              </p>
            )}
          </section>

          <section className="store-panel p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-peach text-brand-tangerine">
                <span className="text-sm font-extrabold">03</span>
              </span>
              <div>
                <h2 className="text-lg font-semibold">Payment</h2>
                <p className="mt-1 text-xs text-brand-muted">
                  All transactions are encrypted and processed by Paystack.
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-brand-line bg-brand-cream/60 p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-brand-forest">
                <LockKeyhole className="h-4 w-4" />
                Secure card payment
              </div>
              <p className="mt-2 text-xs leading-5 text-brand-muted">
                You will be redirected to Paystack to complete payment. We never see or store your card details.
              </p>
            </div>

            <div className="mt-5">
              {!ratesReady ? (
                <Button className="h-12 w-full" disabled>
                  Exchange rates unavailable
                </Button>
              ) : !emailValid ? (
                <Button className="h-12 w-full" disabled>
                  Enter a valid email to continue
                </Button>
              ) : !shippingComplete ? (
                <Button className="h-12 w-full" disabled>
                  Complete your shipping address
                </Button>
              ) : (
                <PaystackButton
                  {...componentProps}
                  disabled={paying}
                  className="inline-flex h-12 w-full items-center justify-center rounded-full bg-brand-ink px-6 text-sm font-semibold text-white shadow-warm transition hover:bg-brand-rose-deep disabled:cursor-not-allowed disabled:opacity-60"
                />
              )}
              {!ratesReady && (
                <p className="mt-2 text-center text-[10px] text-brand-muted">
                  Refresh the page to load current exchange rates before paying.
                </p>
              )}
              {ratesReady && !shippingComplete && (
                <p className="mt-2 text-center text-[10px] text-brand-muted">
                  Add your shipping address above to continue.
                </p>
              )}
            </div>

            <div className="mt-4 flex items-center justify-center gap-4 text-[9px] font-extrabold uppercase tracking-[0.12em] text-brand-muted">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-brand-forest" />
                Encrypted
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-brand-forest" />
                Instant confirmation
              </span>
            </div>
          </section>
        </div>

        <aside className="store-panel overflow-hidden lg:sticky lg:top-28">
          <div className="border-b border-brand-line px-5 py-4">
            <h2 className="font-display text-xl font-medium">Order summary</h2>
            <p className="mt-1 text-xs text-brand-muted">
              {cart.reduce((sum, item) => sum + item.quantity, 0)} item
              {cart.reduce((sum, item) => sum + item.quantity, 0) === 1 ? "" : "s"} in your bag
            </p>
          </div>

          <div className="max-h-[330px] space-y-4 overflow-y-auto p-5">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <ProductImage src={item.image} alt={item.name} className="h-14 w-14 shrink-0 rounded-xl" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-extrabold">{item.name}</p>
                  <p className="mt-0.5 text-[10px] font-semibold text-brand-muted">
                    {getProductCategory(item).label} · Qty {item.quantity}
                  </p>
                </div>
                <p className="shrink-0 text-xs font-bold">
                  {formatMoney(item.price * item.quantity, currency, exchangeRates)}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-brand-line bg-brand-cream/50 px-5 py-5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-brand-muted">Subtotal</span>
              <span className="font-extrabold">{formatMoney(totalUSD, currency, exchangeRates)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="font-semibold text-brand-muted">Delivery</span>
              <span className="font-bold text-brand-forest">Calculated at checkout</span>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-brand-line pt-4">
              <span className="font-extrabold">Total</span>
              <span className="text-xl font-extrabold">{formatMoney(totalUSD, currency, exchangeRates)}</span>
            </div>
            {shippingComplete && (
              <p className="mt-3 text-[10px] leading-5 text-brand-muted">
                Shipping to {shipping.city}, {shipping.state}.
              </p>
            )}
            <p className="mt-3 text-[10px] leading-5 text-brand-muted">
              By completing your order you agree to Glowora&apos;s terms of service and privacy policy.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;
