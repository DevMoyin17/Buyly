import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { useAuthStore } from "@/lib/auth";
import { formatMoney } from "@/lib/format";
import { getProductCategory } from "@/lib/catalog";
import ProductImage from "@/components/storefront/ProductImage";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const CartDrawer = ({ open, onClose }) => {
  const cart = useStore((state) => state.cart);
  const currency = useStore((state) => state.currency);
  const exchangeRates = useStore((state) => state.exchangeRates);
  const removeFromCart = useStore((state) => state.removeFromCart);
  const updateQuantity = useStore((state) => state.updateQuantity);
  const clearCart = useStore((state) => state.clearCart);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    onClose();

    if (!user) {
      toast.info("Sign in or create an account to check out.");
      navigate("/signin", { state: { from: "/checkout" } });
      return;
    }

    navigate("/checkout");
  };

  const handleQuantity = async (item, nextQuantity) => {
    try {
      await updateQuantity(item.id, nextQuantity);
    } catch {
      toast.error("Could not update quantity. Please try again.");
    }
  };

  const handleRemove = async (item) => {
    try {
      await removeFromCart(item.id);
      toast.success(`${item.name} removed from your bag`);
    } catch {
      toast.error("Could not remove this item. Please try again.");
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart(true);
      toast.success("Your bag has been cleared");
    } catch {
      toast.error("Could not clear your bag. Please try again.");
    }
  };

  return (
    <Sheet open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-[430px]">
        <SheetHeader className="border-b border-brand-line px-6 py-5 pr-14 text-left">
          <div className="flex items-center gap-2 text-brand-tangerine">
            <ShoppingBag className="h-4 w-4" />
            <span className="text-[10px] font-extrabold uppercase tracking-[0.18em]">
              Your selection
            </span>
          </div>
          <SheetTitle className="font-display text-3xl font-medium">Shopping bag</SheetTitle>
          <p className="text-xs text-brand-muted">
            {itemCount ? `${itemCount} item${itemCount === 1 ? "" : "s"} ready to go` : "Your bag is waiting for something good."}
          </p>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-16 text-center">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-brand-peach text-brand-tangerine">
                <ShoppingBag className="h-7 w-7" />
              </span>
              <h3 className="mt-5 text-lg font-extrabold">Your bag is empty</h3>
              <p className="mt-2 max-w-[240px] text-sm leading-6 text-brand-muted">
                Explore the collection and find something worth keeping.
              </p>
              <Button
                className="mt-5"
                onClick={() => {
                  onClose();
                  navigate("/#shop");
                }}
              >
                Start shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-5">
              {cart.map((item) => {
                const category = getProductCategory(item);
                return (
                  <div key={item.id} className="flex gap-3.5 border-b border-brand-line/70 pb-5 last:border-0 last:pb-0">
                    <ProductImage
                      src={item.image}
                      alt={item.name}
                      className="h-[88px] w-[76px] shrink-0 rounded-xl"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-brand-muted">
                            {category.label}
                          </p>
                          <h3 className="mt-1 text-sm font-extrabold leading-snug">{item.name}</h3>
                        </div>
                        <button
                          type="button"
                          className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-brand-muted transition hover:bg-red-50 hover:text-red-500"
                          onClick={() => handleRemove(item)}
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="mt-1 text-sm font-bold text-brand-ink">
                        {formatMoney(item.price, currency, exchangeRates)}
                      </p>
                      <div className="mt-3 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1 rounded-lg border border-brand-line bg-white p-0.5">
                          <button
                            type="button"
                            className="grid h-7 w-7 place-items-center rounded-md text-brand-muted transition hover:bg-brand-peach hover:text-brand-ink"
                            onClick={() => handleQuantity(item, Math.max(1, item.quantity - 1))}
                            aria-label={`Decrease quantity of ${item.name}`}
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="min-w-5 text-center text-xs font-bold">{item.quantity}</span>
                          <button
                            type="button"
                            className="grid h-7 w-7 place-items-center rounded-md text-brand-muted transition hover:bg-brand-peach hover:text-brand-ink"
                            onClick={() => handleQuantity(item, item.quantity + 1)}
                            aria-label={`Increase quantity of ${item.name}`}
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <span className="text-xs font-bold text-brand-muted">
                          {formatMoney(item.price * item.quantity, currency, exchangeRates)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              <button
                type="button"
                className="text-[11px] font-bold text-brand-muted underline decoration-brand-line underline-offset-4 transition hover:text-brand-tangerine"
                onClick={handleClearCart}
              >
                Clear bag
              </button>
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-brand-line bg-brand-cream/70 px-6 py-5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-brand-muted">Subtotal</span>
              <span className="text-lg font-extrabold">{formatMoney(total, currency, exchangeRates)}</span>
            </div>
            <p className="mt-1 text-[11px] leading-5 text-brand-muted">
              Taxes and shipping are calculated at checkout.
            </p>
            <Button className="mt-4 w-full" onClick={handleCheckout}>
              Continue to checkout
            </Button>
            <button
              type="button"
              className="mt-3 w-full text-center text-xs font-bold text-brand-muted transition hover:text-brand-ink"
              onClick={onClose}
            >
              Continue shopping
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
