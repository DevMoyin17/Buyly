import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.12em] transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-brand-ink text-white shadow-sm",
        secondary:
          "border-transparent bg-brand-rose text-white",
        soft:
          "border-transparent bg-brand-blush text-brand-rose-deep",
        success:
          "border-transparent bg-brand-blush text-brand-rose-deep",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground",
        outline: "border-brand-line bg-white text-brand-ink",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  ...props
}) {
  return (<div className={cn(badgeVariants({ variant }), className)} {...props} />);
}

export { Badge, badgeVariants }
