import SectionHeading from "@/components/storefront/SectionHeading";
import ProductImage from "@/components/storefront/ProductImage";
import Reveal from "@/components/storefront/Reveal";

const CategorySection = ({ categories = [], activeCategory = "all", onSelect }) => {
  if (!categories.length) return null;

  return (
    <section id="categories" className="store-section container">
      <SectionHeading
        title="Shop By Categories"
        align="center"
        className="mx-auto max-w-2xl"
      />

      <Reveal className="mt-8">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
        {categories.map((category) => {
          const isActive = activeCategory === category.id;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onSelect?.(category.id)}
              className={`group flex flex-col overflow-hidden rounded-[18px] border bg-white p-2 text-left transition duration-300 hover:-translate-y-1 hover:shadow-soft ${
                isActive
                  ? "border-brand-tangerine ring-2 ring-brand-tangerine/15"
                  : "border-brand-line"
              }`}
            >
              <ProductImage
                src={category.cover}
                alt={category.label}
                className="aspect-[4/3] w-full rounded-[12px] bg-brand-blush"
                imageClassName="group-hover:scale-105"
              />
              <div className="px-1 pb-1 pt-3 text-center">
                <p className="font-display text-[17px] font-medium leading-tight text-brand-ink">
                  {category.label}
                </p>
                <p className="mt-1 text-[10px] font-semibold text-brand-muted">
                  {category.count} Product{category.count === 1 ? "" : "s"}
                </p>
              </div>
            </button>
          );
        })}
        </div>
      </Reveal>
    </section>
  );
};

export default CategorySection;
