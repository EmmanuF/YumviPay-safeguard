
import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    gradient?: "neon" | "electric" | "dark" | "none" | "teal" | "blue" | "orange" | "yellow";
    hoverEffect?: boolean;
    coloredBorder?: "accent" | "secondary" | "destructive" | "none" | "primary" | "success" | "info";
  }
>(({ className, gradient = "none", hoverEffect = false, coloredBorder = "none", ...props }, ref) => {
  const gradientStyles = {
    neon: "bg-gradient-to-br from-accent-500/10 to-background border-l-4 border-accent-500",
    electric: "bg-gradient-to-br from-secondary-500/10 to-background border-l-4 border-secondary-500",
    dark: "bg-gradient-to-br from-primary-500/10 to-background border-l-4 border-primary-500",
    teal: "bg-gradient-to-br from-primary-500/10 to-background border-l-4 border-primary-500",
    blue: "bg-gradient-to-br from-blue-500/10 to-background border-l-4 border-blue-500",
    orange: "bg-gradient-to-br from-accent-500/10 to-background border-l-4 border-accent-500",
    yellow: "bg-gradient-to-br from-secondary-500/10 to-background border-l-4 border-secondary-500",
    none: ""
  };

  const borderStyles = {
    accent: "border-l-4 border-accent-500",
    secondary: "border-l-4 border-secondary-500",
    destructive: "border-l-4 border-destructive",
    primary: "border-l-4 border-primary-500",
    success: "border-l-4 border-green-500",
    info: "border-l-4 border-blue-500",
    none: ""
  };

  const hoverStyles = hoverEffect ? 
    "transition-all duration-300 hover:shadow-lg hover:shadow-accent-500/20 hover:translate-y-[-3px]" : "";

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
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
      "text-2xl font-semibold leading-none tracking-tight",
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
    className={cn("text-sm text-muted-foreground", className)}
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
