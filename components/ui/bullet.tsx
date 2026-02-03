import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const bulletVariants = cva(
  "inline-block rounded-full",
  {
    variants: {
      variant: {
        default: "bg-muted-foreground",
        success: "bg-green-500",
        warning: "bg-yellow-500",
        destructive: "bg-red-500",
      },
      size: {
        default: "h-2 w-2",
        sm: "h-1.5 w-1.5",
        lg: "h-3 w-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BulletProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof bulletVariants> {}

const Bullet = React.forwardRef<HTMLSpanElement, BulletProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(bulletVariants({ variant, size }), className)}
        {...props}
      />
    )
  }
)
Bullet.displayName = "Bullet"

export { Bullet, bulletVariants }
