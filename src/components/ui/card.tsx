
import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    gradient?: "neon" | "electric" | "dark" | "none" | "crimson" | "gold" | "brown" | "blue" | "green" | "purple" | "orange" | "navy" | "mint" | "navy-gold" | "mint-gray";
    hoverEffect?: boolean;
    coloredBorder?: "accent" | "secondary" | "destructive" | "none" | "primary" | "success" | "info" | "navy" | "mint" | "gold";
  }
>(({ className, gradient = "none", hoverEffect = false, coloredBorder = "none", ...props }, ref) => {
  const gradientStyles = {
    neon: "bg-gradient-to-br from-accent-500/15 to-background border-l-4 border-accent-500 shadow-md",
    electric: "bg-gradient-to-br from-secondary-500/15 to-background border-l-4 border-secondary-500 shadow-md",
    dark: "bg-gradient-to-br from-charcoal-500/15 to-background border-l-4 border-charcoal-600 shadow-md",
    crimson: "bg-gradient-to-br from-red-500/15 to-background border-l-4 border-red-600 shadow-md",
    gold: "bg-gradient-to-br from-primary-500/15 to-background border-l-4 border-primary-500 shadow-md",
    brown: "bg-gradient-to-br from-yellow-800/15 to-background border-l-4 border-yellow-900 shadow-md",
    blue: "bg-gradient-to-br from-blue-500/15 to-background border-l-4 border-blue-600 shadow-md",
    green: "bg-gradient-to-br from-green-500/15 to-background border-l-4 border-green-600 shadow-md",
    purple: "bg-gradient-to-br from-purple-500/15 to-background border-l-4 border-purple-600 shadow-md",
    orange: "bg-gradient-to-br from-orange-500/15 to-background border-l-4 border-orange-600 shadow-md",
    navy: "bg-gradient-to-br from-navy-500/15 to-background border-l-4 border-navy-600 shadow-md",
    mint: "bg-gradient-to-br from-mint-500/15 to-background border-l-4 border-mint-600 shadow-md",
    "navy-gold": "bg-gradient-to-br from-navy-500/15 to-primary-500/15 border-l-4 border-navy-600 shadow-md",
    "mint-gray": "bg-gradient-to-br from-mint-500/15 to-gray-300/40 border-l-4 border-mint-600 shadow-md",
    none: "shadow-sm border border-charcoal-200/30"
  };

  const borderStyles = {
    accent: "border-l-4 border-accent-500",
    secondary: "border-l-4 border-secondary-500",
    destructive: "border-l-4 border-destructive",
    primary: "border-l-4 border-primary-500",
    success: "border-l-4 border-green-600",
    info: "border-l-4 border-blue-600",
    navy: "border-l-4 border-navy-600",
    mint: "border-l-4 border-mint-600",
    gold: "border-l-4 border-primary-500",
    none: ""
  };

  const hoverStyles = hoverEffect ? 
    "transition-all duration-300 hover:shadow-lg hover:shadow-primary-600/30 hover:translate-y-[-3px]" : "";

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border bg-gray-300 text-charcoal-500",
        gradientStyles[gradient],
        coloredBorder !== "none" && gradient === "none" ? borderStyles[coloredBorder] : "",
        hoverStyles,
        className
      )}
      {...props}
    />
  )
})
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight text-charcoal-500",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground font-medium", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
