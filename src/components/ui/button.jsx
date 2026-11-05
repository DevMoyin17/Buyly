import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-brand-ink text-white shadow-soft hover:-translate-y-0.5 hover:bg-brand-rose-deep",
        secondary:
          "bg-brand-blush text-brand-ink hover:bg-brand-sand",
        forest:
          "bg-brand-rose text-white shadow-soft hover:-translate-y-0.5 hover:bg-brand-rose-deep",
        outline:
          "border border-brand-ink/15 bg-white text-brand-ink shadow-sm hover:border-brand-ink/30 hover:bg-brand-blush",
        ghost: "text-brand-ink hover:bg-brand-blush",
        soft: "bg-brand-blush text-brand-rose-deep hover:bg-brand-sand",
        link: "text-brand-ink underline-offset-4 hover:text-brand-tangerine hover:underline",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-full px-4 text-xs",
        lg: "h-12 rounded-full px-7 text-sm",
        icon: "h-11 w-11 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    (<Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props} />)
  );
})
Button.displayName = "Button"

export { Button, buttonVariants }
