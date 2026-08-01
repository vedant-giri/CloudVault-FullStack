import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-blue-600 text-white shadow-lg hover:bg-blue-700 hover:shadow-xl",
        outline:
          "border border-slate-300 bg-white hover:bg-slate-100",
        secondary:
          "bg-slate-100 text-slate-900 hover:bg-slate-200",
        ghost:
          "hover:bg-slate-100",
        destructive:
          "bg-red-600 text-white hover:bg-red-700",
        link:
          "text-blue-600 underline-offset-4 hover:underline bg-transparent shadow-none",
      },
      size: {
        default: "h-12 px-5",
        sm: "h-10 px-4",
        lg: "h-14 px-6 text-base",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  ...props
}: ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button};