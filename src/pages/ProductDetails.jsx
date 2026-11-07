import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Heart,
  Loader2,
  Minus,
  PackageCheck,
  Plus,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useStore } from "@/lib/store";
import { formatMoney } from "@/lib/format";
import { getProductCategory } from "@/lib/catalog";
import { CONTACT_EMAIL } from "@/lib/config";
import ProductImage from "@/components/storefront/ProductImage";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ProductDetails = () => {
  const { id } = useParams();
  const addToCart = useStore((state) => state.addToCart);
  const inventory = useStore((state) => state.inventory);
  const products = useStore((state) => state.products);
  const fetchProducts = useStore((state) => state.fetchProducts);
  const wishlist = useStore((state) => state.wishlist);
  const toggleWishlist = useStore((state) => state.toggleWishlist);
  const currency = useStore((state) => state.currency);
  const exchangeRates = useStore((state) => state.exchangeRates);

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    let active = true;

    const loadProduct = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await api.fetchProduct(id);
        if (active) setProduct(data);
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setIsLoading(false);
      }
    };

    loadProduct();

    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => {
    if (!products.length) fetchProducts().catch(() => {});
  }, [fetchProducts, products.length]);

  useEffect(() => {
    if (!product) return undefined;
    const previousTitle = document.title;
    document.title = `${product.name} | Glowora`;
    return () => {
      document.title = previousTitle;
    };
  }, [product]);

  const stock = Number(inventory[product?.id] ?? product?.stock ?? 0);
  const soldOut = stock <= 0;
  const category = getProductCategory(product || {});
  const wishlisted = product ? wishlist.includes(product.id) : false;

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter((item) => item.id !== product.id)
      .sort((a, b) => {
        const aMatch = getProductCategory(a).id === category.id ? 1 : 0;
        const bMatch = getProductCategory(b).id === category.id ? 1 : 0;
        return bMatch - aMatch;
      })
      .slice(0, 4);
  }, [category.id, product, products]);

  useEffect(() => {
    if (!soldOut && quantity > stock) setQuantity(stock);
    if (soldOut && quantity !== 1) setQuantity(1);
  }, [quantity, soldOut, stock]);

  const handleAddToCart = async () => {
    if (!product || soldOut) return;
    setAdding(true);
    try {
      await addToCart(product, quantity);
      toast.success(`${quantity} × ${product.name} added to your bag`);
      setQuantity(1);
    } catch (err) {
      toast.error(err?.message || "Could not add this product to your bag.");
    } finally {
      setAdding(false);
    }
  };

  const handleWishlist = () => {
    if (!product) return;
    toggleWishlist(product.id);
    toast.success(wishlisted ? "Removed from wishlist" : "Saved to wishlist");
  };

  if (isLoading) {
    return (
      <div className="container py-8 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-[28px] border border-brand-line bg-white" />
          <div className="space-y-5 py-4">
            <div className="h-3 w-24 animate-pulse rounded-full bg-brand-line" />
            <div className="h-10 w-2/3 animate-pulse rounded-full bg-brand-line" />
            <div className="h-4 w-full animate-pulse rounded-full bg-brand-line" />
            <div className="h-4 w-4/5 animate-pulse rounded-full bg-brand-line" />
            <div className="h-8 w-28 animate-pulse rounded-full bg-brand-line" />
            <div className="h-12 w-full animate-pulse rounded-xl bg-brand-line" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container py-16">
        <div className="store-panel mx-auto max-w-xl px-6 py-14 text-center">
          <h1 className="text-2xl font-extrabold">We could not find that product</h1>
          <p className="mt-2 text-sm text-brand-muted">
            {error || "It may have been removed from the collection."}
          </p>
          <Button asChild className="mt-5">
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
              Back to the shop
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container animate-fade-soft py-5 sm:py-8">
      <nav className="flex flex-wrap items-center gap-1.5 text-[11px] font-semibold text-brand-muted" aria-label="Breadcrumb">
        <Link to="/" className="transition hover:text-brand-tangerine">Home</Link>
        <span>/</span>
        <Link to="/shop" className="transition hover:text-brand-tangerine">Shop</Link>
        <span>/</span>
        <span className="text-brand-ink">{product.name}</span>
      </nav>

      <div className="mt-5 grid gap-8 lg:grid-cols-[1.03fr_0.97fr] lg:gap-12">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="relative overflow-hidden rounded-[28px] border border-brand-line bg-[#FBEDF0] p-4 shadow-card sm:p-6">
            <div className="absolute left-5 top-5 z-10 flex gap-2">
              <Badge variant="soft">{category.label}</Badge>
              {stock <= 5 && stock > 0 && <Badge variant="secondary">Only {stock} left</Badge>}
            </div>
            <ProductImage
              src={product.image}
              alt={product.name}
              className="aspect-square w-full rounded-[20px]"
              imageClassName="object-cover"
              loading="eager"
            />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-brand-line bg-white px-3 py-2.5 text-[10px] font-bold text-brand-muted">
              <ShieldCheck className="h-4 w-4 shrink-0 text-brand-tangerine" />
              Secure payment
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-brand-line bg-white px-3 py-2.5 text-[10px] font-bold text-brand-muted">
              <PackageCheck className="h-4 w-4 shrink-0 text-brand-tangerine" />
              Ready to ship
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-brand-line bg-white px-3 py-2.5 text-[10px] font-bold text-brand-muted">
              <Check className="h-4 w-4 shrink-0 text-brand-tangerine" />
              Curated pick
            </div>
          </div>
        </div>

        <div className="py-1 lg:py-4">
          <p className="eyebrow">{category.label}</p>
          <h1 className="mt-2 font-display text-[38px] font-medium leading-[1.02] tracking-[-0.045em] sm:text-[50px]">
            {product.name}
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-brand-muted">{product.description}</p>

          <div className="mt-6 flex flex-wrap items-end gap-3">
            <p className="font-display text-[34px] font-medium leading-none tracking-[-0.03em]">
              {formatMoney(product.price, currency, exchangeRates)}
            </p>
            <span
              className={`mb-1 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.1em] ${
                soldOut
                  ? "bg-brand-line/50 text-brand-muted"
                  : "bg-brand-forest-mist text-brand-forest"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${soldOut ? "bg-brand-muted" : "bg-brand-forest"}`} />
              {soldOut ? "Sold out" : `${stock} in stock`}
            </span>
          </div>

          <div className="mt-6 border-t border-brand-line pt-5">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-muted">Why you will love it</p>
            <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
              {(product.details || []).map((detail) => (
                <li key={detail} className="flex items-start gap-2 text-xs leading-5 text-brand-ink/75">
                  <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-brand-forest-mist text-brand-forest">
                    <Check className="h-2.5 w-2.5" strokeWidth={3} />
                  </span>
                  {detail}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex h-12 w-fit items-center rounded-xl border border-brand-line bg-white p-1">
              <button
                type="button"
                className="grid h-9 w-9 place-items-center rounded-lg text-brand-muted transition hover:bg-brand-peach hover:text-brand-ink disabled:opacity-40"
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                disabled={quantity <= 1 || soldOut}
                aria-label="Decrease quantity"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="min-w-9 text-center text-sm font-extrabold">{quantity}</span>
              <button
                type="button"
                className="grid h-9 w-9 place-items-center rounded-lg text-brand-muted transition hover:bg-brand-peach hover:text-brand-ink disabled:opacity-40"
                onClick={() => setQuantity((value) => Math.min(stock || 1, value + 1))}
                disabled={soldOut || quantity >= stock}
                aria-label="Increase quantity"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>

            <Button
              className="h-12 flex-1"
              onClick={handleAddToCart}
              disabled={soldOut || adding}
            >
              {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShoppingBag className="h-4 w-4" />}
              {soldOut ? "Sold out" : adding ? "Adding to bag" : "Add to bag"}
            </Button>

            <button
              type="button"
              onClick={handleWishlist}
              className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl border transition ${
                wishlisted
                  ? "border-brand-tangerine bg-brand-peach text-brand-tangerine"
                  : "border-brand-line bg-white text-brand-muted hover:border-brand-ink/20 hover:text-brand-ink"
              }`}
              aria-label={wishlisted ? "Remove from wishlist" : "Save to wishlist"}
              aria-pressed={wishlisted}
            >
              <Heart className="h-5 w-5" fill={wishlisted ? "currentColor" : "none"} />
            </button>
          </div>

          <div className="mt-7 divide-y divide-brand-line border-y border-brand-line">
            <details className="group py-4" open>
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-extrabold">
                Product details
                <Plus className="h-4 w-4 text-brand-muted transition group-open:rotate-45" />
              </summary>
              <p className="mt-3 text-xs leading-6 text-brand-muted">
                {product.description} Product imagery and details are provided by the seller.
              </p>
            </details>
            <details className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-extrabold">
                Delivery &amp; returns
                <Plus className="h-4 w-4 text-brand-muted transition group-open:rotate-45" />
              </summary>
              <p className="mt-3 text-xs leading-6 text-brand-muted">
                Delivery options and timing are confirmed at checkout. For sizing or return help,
                contact us at{" "}
                <a className="font-bold text-brand-tangerine" href={`mailto:${CONTACT_EMAIL}`}>
                  {CONTACT_EMAIL}
                </a>
                .
              </p>
            </details>
            <details className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-extrabold">
                Payment &amp; security
                <Plus className="h-4 w-4 text-brand-muted transition group-open:rotate-45" />
              </summary>
              <p className="mt-3 text-xs leading-6 text-brand-muted">
                Checkout is processed securely by Paystack. Glowora does not store card details.
              </p>
            </details>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="pt-14 sm:pt-20">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="eyebrow">Keep exploring</p>
              <h2 className="mt-2 font-display text-3xl font-medium tracking-[-0.03em] sm:text-4xl">You may also like</h2>
            </div>
            <Link to="/shop" className="link-arrow hidden sm:inline-flex">
              Shop all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
            {relatedProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetails;
