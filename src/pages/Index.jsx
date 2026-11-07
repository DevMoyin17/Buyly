import { useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AlertTriangle, ArrowRight, RotateCcw } from "lucide-react";
import { useStore } from "@/lib/store";
import { buildCategories, getFeaturedProduct } from "@/lib/catalog";
import HeroBanner from "@/components/storefront/HeroBanner";
import CategorySection from "@/components/storefront/CategorySection";
import FeaturedDeal from "@/components/storefront/FeaturedDeal";
import SectionHeading from "@/components/storefront/SectionHeading";
import Newsletter from "@/components/storefront/Newsletter";
import ProductCard from "@/components/ProductCard";
import ProductCardSkeleton from "@/components/storefront/ProductCardSkeleton";
import Reveal from "@/components/storefront/Reveal";
import { Button } from "@/components/ui/button";

const HOME_PRODUCT_LIMIT = 8;

const productRank = (product) => {
  const value = Number(product.id);
  return Number.isFinite(value) ? value : -1;
};

const Index = () => {
  const products = useStore((state) => state.products);
  const isLoading = useStore((state) => state.isLoading);
  const error = useStore((state) => state.error);
  const fetchProducts = useStore((state) => state.fetchProducts);
  const navigate = useNavigate();
  const location = useLocation();

  const categories = useMemo(() => buildCategories(products), [products]);
  const bestsellers = useMemo(() => products.slice(0, 4), [products]);
  const featuredProduct = useMemo(() => getFeaturedProduct(products), [products]);
  const previewProducts = useMemo(
    () =>
      [...products]
        .sort((a, b) => productRank(b) - productRank(a))
        .slice(0, HOME_PRODUCT_LIMIT),
    [products],
  );

  useEffect(() => {
    fetchProducts().catch(() => {});
  }, [fetchProducts]);

  useEffect(() => {
    if (!location.hash) return undefined;
    const timer = window.setTimeout(() => {
      const target = document.getElementById(location.hash.replace("#", ""));
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
    return () => window.clearTimeout(timer);
  }, [location.hash]);

  const handleCategorySelect = (categoryId) => {
    navigate(`/shop?category=${encodeURIComponent(categoryId)}`);
  };

  const hasProducts = products.length > 0;

  return (
    <div className="overflow-hidden animate-fade-soft">
      <HeroBanner products={products} />

      {error && !hasProducts && (
        <section className="container pt-12">
          <div className="store-panel px-6 py-12 text-center sm:px-10">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-red-50 text-red-500">
              <AlertTriangle className="h-6 w-6" />
            </span>
            <h2 className="mt-5 text-2xl font-extrabold">The collection could not load</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-brand-muted">{error}</p>
            <Button className="mt-5" onClick={() => fetchProducts()}>
              Try again
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </section>
      )}

      {hasProducts && (
        <CategorySection categories={categories} onSelect={handleCategorySelect} />
      )}

      {hasProducts && (
        <FeaturedDeal
          product={featuredProduct}
          productCount={products.length}
          categoryCount={categories.length}
        />
      )}

      {(hasProducts || isLoading) && (
        <section id="bestsellers" className="container py-10 sm:py-12">
          <SectionHeading
            title="Our Bestsellers"
            action={
              <Link
                to="/shop"
                className="inline-flex h-9 items-center rounded-full border border-brand-ink/15 bg-white px-4 text-[11px] font-semibold text-brand-ink transition hover:bg-brand-blush"
              >
                View All
              </Link>
            }
          />

          <div className="mt-7 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
            {isLoading && !hasProducts
              ? Array.from({ length: 4 }).map((_, index) => <ProductCardSkeleton key={index} />)
              : bestsellers.map((product, index) => (
                  <Reveal key={product.id} delay={index * 70} className="h-full">
                    <ProductCard product={product} />
                  </Reveal>
                ))}
          </div>
        </section>
      )}

      {hasProducts && (
        <section id="shop" className="container py-8 sm:py-12">
          <SectionHeading
            eyebrow="The full edit"
            title="Shop the collection"
            description="A curated look at the newest formulas your skin will love."
            action={
              <Link
                to="/shop"
                className="inline-flex h-9 items-center rounded-full border border-brand-ink/15 bg-white px-4 text-[11px] font-semibold text-brand-ink transition hover:bg-brand-blush"
              >
                View all products
              </Link>
            }
          />

          <div className="mt-7 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
            {previewProducts.map((product, index) => (
              <Reveal key={product.id} delay={Math.min(index, 7) * 55} className="h-full">
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/shop">
                View all {products.length} products
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      )}

      <Newsletter />
    </div>
  );
};

export default Index;
