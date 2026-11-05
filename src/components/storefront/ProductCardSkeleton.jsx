const ProductCardSkeleton = () => (
  <div className="overflow-hidden rounded-[24px] border border-brand-line bg-white p-3">
    <div className="skeleton aspect-square rounded-[14px] bg-[#F8E6EA]" />
    <div className="space-y-3 px-1.5 pt-4">
      <div className="h-2.5 w-20 animate-pulse rounded-full bg-brand-line" />
      <div className="h-4 w-36 animate-pulse rounded-full bg-brand-line" />
      <div className="flex items-center justify-between pt-3">
        <div className="space-y-2">
          <div className="h-4 w-16 animate-pulse rounded-full bg-brand-line" />
          <div className="h-2.5 w-20 animate-pulse rounded-full bg-brand-line/70" />
        </div>
        <div className="h-10 w-10 animate-pulse rounded-xl bg-brand-line/70" />
      </div>
    </div>
  </div>
);

export default ProductCardSkeleton;
