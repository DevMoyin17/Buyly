import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AlertTriangle, Heart, RotateCcw, Search, SlidersHorizontal, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { buildCategories, filterProducts } from "@/lib/catalog";
import ProductCard from "@/components/ProductCard";
import ProductCardSkeleton from "@/components/storefront/ProductCardSkeleton";
import Reveal from "@/components/storefront/Reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
];

const Shop = () => {
  const products = useStore((state) => state.products);
  const isLoading = useStore((state) => state.isLoading);
  const error = useStore((state) => state.error);
  const fetchProducts = useStore((state) => state.fetchProducts);
  const wishlist = useStore((state) => state.wishlist);

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(
    () => searchParams.get("category") || "all",
  );
  const [wishlistOnly, setWishlistOnly] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  const searchRef = useRef(null);

  const categories = useMemo(() => buildCategories(products), [products]);
  const hasProducts = products.length > 0;

  useEffect(() => {
    fetchProducts().catch(() => {});
  }, [fetchProducts]);

  useEffect(() => {
    const handleSearchEvent = () => {
      searchRef.current?.focus();
      searchRef.current?.select();
    };

    window.addEventListener("glowora:focus-search", handleSearchEvent);
    return () => window.removeEventListener("glowora:focus-search", handleSearchEvent);
  }, []);

  useEffect(() => {
    const categoryFromUrl = searchParams.get("category") || "all";
    setActiveCategory(categoryFromUrl);
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    let list = filterProducts(products, activeCategory);
    const query = searchQuery.trim().toLowerCase();

    if (wishlistOnly) {
      list = list.filter((product) => wishlist.includes(product.id));
    }

    if (query) {
      list = list.filter((product) =>
        `${product.name} ${product.description}`.toLowerCase().includes(query),
      );
    }

    if (sortBy === "price-asc") {
      list = [...list].sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === "price-desc") {
      list = [...list].sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === "name-asc") {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "name-desc") {
      list = [...list].sort((a, b) => b.name.localeCompare(a.name));
    }

    return list;
  }, [activeCategory, products, searchQuery, sortBy, wishlist, wishlistOnly]);

  const selectCategory = (categoryId) => {
    setActiveCategory(categoryId);
    setWishlistOnly(false);
    setSearchQuery("");

    const nextParams = new URLSearchParams(searchParams);
    if (categoryId === "all") {
      nextParams.delete("category");
    } else {
      nextParams.set("category", categoryId);
    }
    setSearchParams(nextParams, { replace: true });
  };

  const resetFilters = () => {
    setSearchQuery("");
    setActiveCategory("all");
    setWishlistOnly(false);
    setSortBy("featured");
    setSearchParams({}, { replace: true });
  };

  return (
    <div className="container animate-fade-soft py-8 sm:py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">The full edit</p>
          <h1 className="mt-2 font-display text-[38px] font-medium leading-none tracking-[-0.04em] text-brand-ink sm:text-5xl">
            Shop the collection
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-brand-muted">
            Search, filter and find the formulas your skin will love.
          </p>
        </div>
        {hasProducts && (
          <p className="text-xs font-semibold text-brand-muted">
            {products.length} product{products.length === 1 ? "" : "s"}
          </p>
        )}
      </div>

      {error && !hasProducts && (
        <div className="store-panel mt-7 px-6 py-10 text-center sm:px-10">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-red-50 text-red-500">
            <AlertTriangle className="h-6 w-6" />
          </span>
          <h2 className="mt-5 text-xl font-extrabold">The collection could not load</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-brand-muted">{error}</p>
          <Button className="mt-5" onClick={() => fetchProducts()}>
            Try again
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="mt-7 rounded-[22px] border border-brand-line bg-white p-3 shadow-sm sm:p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted" />
            <Input
              ref={searchRef}
              id="shop-search"
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by product name or description"
              className="h-11 border-brand-line bg-brand-cream/60 pl-10 pr-10"
              aria-label="Search products"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-brand-muted transition hover:bg-brand-peach hover:text-brand-ink"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setWishlistOnly((current) => !current)}
              className={`inline-flex h-11 items-center gap-2 rounded-xl border px-3.5 text-xs font-extrabold transition ${
                wishlistOnly
                  ? "border-brand-tangerine bg-brand-peach text-brand-tangerine"
                  : "border-brand-line bg-white text-brand-muted hover:border-brand-ink/20 hover:text-brand-ink"
              }`}
              aria-pressed={wishlistOnly}
            >
              <Heart className="h-4 w-4" fill={wishlistOnly ? "currentColor" : "none"} />
              Wishlist
              {wishlist.length > 0 && (
                <span className="rounded-full bg-white/70 px-1.5 py-0.5 text-[9px]">{wishlist.length}</span>
              )}
            </button>

            <div className="flex items-center gap-2">
              <SlidersHorizontal className="hidden h-4 w-4 text-brand-muted sm:block" />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-11 w-[172px] max-w-full bg-white" aria-label="Sort products">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="end">
                  {SORT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="hide-scrollbar mt-3 flex gap-2 overflow-x-auto border-t border-brand-line/70 pt-3">
          <button
            type="button"
            onClick={() => selectCategory("all")}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-[11px] font-extrabold transition ${
              activeCategory === "all"
                ? "bg-brand-forest text-white"
                : "bg-brand-cream text-brand-muted hover:text-brand-ink"
            }`}
          >
            All products
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => selectCategory(category.id)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-[11px] font-extrabold transition ${
                activeCategory === category.id
                  ? "bg-brand-forest text-white"
                  : "bg-brand-cream text-brand-muted hover:text-brand-ink"
              }`}
            >
              {category.label}
              <span className="ml-1.5 text-[9px] opacity-60">{category.count}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-xs font-semibold text-brand-muted">
          {isLoading && !hasProducts
            ? "Loading the collection…"
            : `${filteredProducts.length} product${filteredProducts.length === 1 ? "" : "s"} found`}
          {wishlistOnly && hasProducts ? " in your wishlist" : ""}
        </p>
        {(searchQuery || activeCategory !== "all" || wishlistOnly) && (
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-brand-muted transition hover:text-brand-tangerine"
          >
            <RotateCcw className="h-3 w-3" />
            Reset filters
          </button>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
        {isLoading && !hasProducts
          ? Array.from({ length: 8 }).map((_, index) => <ProductCardSkeleton key={index} />)
          : filteredProducts.map((product, index) => (
              <Reveal key={product.id} delay={Math.min(index, 7) * 55} className="h-full">
                <ProductCard product={product} />
              </Reveal>
            ))}
      </div>

      {!isLoading && hasProducts && filteredProducts.length === 0 && (
        <div className="store-panel mt-4 flex flex-col items-center px-6 py-14 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-brand-peach text-brand-tangerine">
            {wishlistOnly ? <Heart className="h-6 w-6" /> : <Search className="h-6 w-6" />}
          </span>
          <h3 className="mt-4 text-xl font-extrabold">
            {wishlistOnly ? "Your wishlist is empty" : "No products match"}
          </h3>
          <p className="mt-2 max-w-sm text-sm leading-6 text-brand-muted">
            {wishlistOnly
              ? "Tap the heart on any product to save it here for later."
              : "Try another search term or clear the current filters to see the full collection."}
          </p>
          <Button className="mt-5" variant="outline" onClick={resetFilters}>
            Clear filters
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default Shop;
