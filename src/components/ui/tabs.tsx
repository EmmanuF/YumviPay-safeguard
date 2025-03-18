
import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & {
    variant?: "default" | "pills" | "underline" | "gradient";
  }
>(({ className, variant = "default", ...props }, ref) => {
  const variantStyles = {
    default: "bg-muted p-1",
    pills: "bg-secondary-50/80 p-1 backdrop-blur-sm border border-secondary-100",
    underline: "bg-transparent p-0 border-b border-border",
    gradient: "bg-gradient-to-r from-primary-50/90 to-secondary-50/90 p-1 backdrop-blur-sm border border-white/20 shadow-md"
  };

  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        "inline-flex h-auto min-h-10 items-center justify-center rounded-md text-muted-foreground overflow-visible",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  )
})
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
    variant?: "default" | "pills" | "underline" | "colorful";
  }
>(({ className, variant = "default", ...props }, ref) => {
  const variantStyles = {
    default: "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
    pills: "data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary-500 data-[state=active]:to-primary-600 data-[state=active]:text-white data-[state=active]:shadow-md border border-transparent data-[state=active]:border-primary-600",
    underline: "border-b-2 border-transparent data-[state=active]:border-primary-500 rounded-none data-[state=active]:text-foreground",
    colorful: "data-[state=active]:shadow-md border border-transparent transition-all duration-300 hover:bg-opacity-90"
  };

  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 overflow-visible",
        variantStyles[variant || "default"],
        className
      )}
      {...props}
    />
  )
})
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-3 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 overflow-visible",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
