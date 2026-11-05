import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Loader2, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { formatMoney } from "@/lib/format";
import { getProductCategory } from "@/lib/catalog";
import ProductImage from "@/components/storefront/ProductImage";

const ProductCard = ({ product, showNew = false }) => {
  const addToCart = useStore((state) => state.addToCart);
  const inventory = useStore((state) => state.inventory);
  const wishlist = useStore((state) => state.wishlist);
  const toggleWishlist = useStore((state) => state.toggleWishlist);
  const currency = useStore((state) => state.currency);
  const exchangeRates = useStore((state) => state.exchangeRates);
  const [adding, setAdding] = useState(false);

  const category = getProductCategory(product);
  const stock = Number(inventory[product.id] ?? product.stock ?? 0);
  const wishlisted = wishlist.includes(product.id);
  const soldOut = stock <= 0;

  const handleAddToCart = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (soldOut || adding) return;

    setAdding(true);
    try {
      await addToCart(product, 1);
      toast.success(`${product.name} added to your bag`);
    } catch (error) {
      toast.error(error?.message || "Could not add this item. Try again.");
    } finally {
      setAdding(false);
    }
  };

  const handleWishlist = (event) => {
    event.preventDefault();
    event.stopPropagation();
    toggleWishlist(product.id);
    toast.success(wishlisted ? "Removed from wishlist" : "Saved to wishlist");
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-brand-line bg-white p-3 shadow-card transition duration-300 hover:-translate-y-1 hover:border-brand-rose/30 hover:shadow-soft">
      <div className="relative overflow-hidden rounded-[14px] bg-[#FBEDF0]">
        <Link to={`/product/${product.id}`} className="block aspect-square">
          <ProductImage
            src={product.image}
            alt={product.name}
            className="h-full w-full"
            imageClassName="group-hover:scale-105"
          />
        </Link>

        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {showNew && (
            <span className="inline-flex rounded-full bg-brand-forest px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.14em] text-white">
              New
            </span>
          )}
          {soldOut && (
            <span className="inline-flex rounded-full bg-brand-ink px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.14em] text-white">
              Sold out
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleWishlist}
          className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full border border-white/70 bg-white/85 text-brand-ink shadow-sm backdrop-blur transition hover:scale-105 hover:bg-white"
          aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          aria-pressed={wishlisted}
        >
          <Heart
            className={`h-4 w-4 ${wishlisted ? "text-brand-tangerine" : "text-brand-ink/65"}`}
            fill={wishlisted ? "currentColor" : "none"}
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col px-1.5 pb-1 pt-4">
        <p className="text-[9px] font-bold uppercase tracking-[0.17em] text-brand-rose-deep/65">
          {category.label}
        </p>
        <Link to={`/product/${product.id}`} className="mt-1.5">
          <h3 className="line-clamp-2 text-[15px] font-bold leading-snug text-brand-ink transition group-hover:text-brand-rose-deep">
            {product.name}
          </h3>
        </Link>

        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <div>
            <p className="text-base font-bold text-brand-ink">
              {formatMoney(product.price, currency, exchangeRates)}
            </p>
            <p
              className={`mt-1 text-[10px] font-semibold ${
                soldOut
                  ? "text-brand-muted"
                  : stock <= 5
                    ? "text-brand-rose-deep"
                    : "text-brand-muted/80"
              }`}
            >
              {soldOut ? "Currently unavailable" : stock <= 5 ? `Only ${stock} left` : "In stock"}
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={soldOut || adding}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-brand-ink/15 bg-white text-brand-ink transition hover:-translate-y-0.5 hover:border-brand-ink hover:bg-brand-ink hover:text-white disabled:cursor-not-allowed disabled:border-brand-line disabled:text-brand-muted/50"
            aria-label={`Add ${product.name} to bag`}
          >
            {adding ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ShoppingBag className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
