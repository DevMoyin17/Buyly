import { useEffect, useState } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

const ProductImage = ({
  src,
  alt,
  className,
  imageClassName,
  fit = "cover",
  loading = "lazy",
}) => {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  return (
    <div className={cn("image-fallback relative overflow-hidden", className)}>
      {src && !failed ? (
        <img
          src={src}
          alt={alt}
          loading={loading}
          onError={() => setFailed(true)}
          className={cn(
            "h-full w-full transition duration-500",
            fit === "contain" ? "object-contain" : "object-cover",
            imageClassName,
          )}
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-brand-muted">
          <ImageOff className="h-7 w-7" aria-hidden="true" />
          <span className="px-3 text-center text-[10px] font-bold uppercase tracking-[0.14em]">
            {alt || "Glowora pick"}
          </span>
        </div>
      )}
    </div>
  );
};

export default ProductImage;
