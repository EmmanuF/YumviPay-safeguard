
import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

interface SwitchProps extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
  accentColor?: "primary" | "secondary" | "yellow" | "purple" | string;
}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(({ className, accentColor = "primary", ...props }, ref) => {
  // Map accent colors to their corresponding Tailwind classes
  const colorMap: Record<string, string> = {
    primary: "data-[state=checked]:bg-primary",
    secondary: "data-[state=checked]:bg-secondary",
    yellow: "data-[state=checked]:bg-yellow-500",
    purple: "data-[state=checked]:bg-purple-500",
  }

  // Get the color class or use the default
  const colorClass = colorMap[accentColor] || colorMap.primary

  return (
    <SwitchPrimitives.Root
      className={cn(
        "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=unchecked]:bg-input",
        colorClass,
        className
      )}
      {...props}
      ref={ref}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
        )}
      />
    </SwitchPrimitives.Root>
  )
})
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
