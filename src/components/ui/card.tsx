
import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    gradient?: "purple" | "blue" | "green" | "orange" | "none";
    hoverEffect?: boolean;
    coloredBorder?: "primary" | "success" | "warning" | "info" | "none";
  }
>(({ className, gradient = "none", hoverEffect = false, coloredBorder = "none", ...props }, ref) => {
  const gradientStyles = {
    purple: "bg-gradient-to-br from-primary-50/80 to-white border-l-4 border-primary-500",
    blue: "bg-gradient-to-br from-blue-50/80 to-white border-l-4 border-blue-500",
    green: "bg-gradient-to-br from-green-50/80 to-white border-l-4 border-green-500",
    orange: "bg-gradient-to-br from-orange-50/80 to-white border-l-4 border-orange-500",
    none: ""
  };

  const borderStyles = {
    primary: "border-l-4 border-primary-500",
    success: "border-l-4 border-green-500",
    warning: "border-l-4 border-orange-500",
    info: "border-l-4 border-blue-500",
    none: ""
  };

  const hoverStyles = hoverEffect ? 
    "transition-all duration-300 hover:shadow-lg hover:translate-y-[-3px]" : "";

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
