
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  ToastHeader,
  ToastContent,
  ToastFooter,
  ToastAction,
} from "@/components/ui/toast"
import { CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { useEffect, useRef } from "react"

export function Toaster() {
  const { toasts } = useToast()
  
  // For managing progress updates
  const progressIntervals = useRef(new Map<string, NodeJS.Timeout>())
  
  // Clean up any progress intervals when component unmounts
  useEffect(() => {
    return () => {
      progressIntervals.current.forEach((interval) => {
        clearInterval(interval)
      })
      progressIntervals.current.clear()
    }
  }, [])

  return (
    <ToastProvider>
      {toasts.map(function ({ 
        id, 
        title, 
        description, 
        action, 
        variant, 
        progress, 
        actions, 
        custom, 
        animation,
        footer,
        ...props 
      }) {
        // Select the appropriate icon based on variant
        const IconComponent = variant === "success" ? CheckCircle
          : variant === "destructive" ? AlertCircle
          : variant === "warning" ? AlertTriangle
          : variant === "info" ? Info
          : null

        // Handle interactive toast with progress bar
        if (variant === "interactive") {
          return (
            <Toast 
              key={id} 
              variant={variant} 
              className={cn(
                animation && `animate-${animation}`,
                "overflow-hidden"
              )}
              {...props}
            >
              <ToastHeader>
                {IconComponent && (
                  <IconComponent 
                    className="h-5 w-5 shrink-0 mr-3" 
                    aria-hidden="true" 
                  />
                )}
                <div className="grid gap-1 flex-1">
                  {title && <ToastTitle>{title}</ToastTitle>}
                  {description && (
                    <ToastDescription>{description}</ToastDescription>
                  )}
                </div>
                <ToastClose />
              </ToastHeader>
              
              {(progress || custom) && (
                <ToastContent>
                  {/* Custom content */}
                  {custom}
                  
                  {/* Progress bar */}
                  {progress && (
                    <div className="mt-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium">
                          {progress.showValue && `${progress.value}%`}
                        </span>
                      </div>
                      <Progress 
                        value={progress.value} 
                        max={progress.max || 100} 
                        className={cn(
                          "h-2 w-full",
                          progress.status === "success" && "bg-green-200 [&>div]:bg-green-500",
                          progress.status === "error" && "bg-red-200 [&>div]:bg-red-500",
                          progress.status === "warning" && "bg-yellow-200 [&>div]:bg-yellow-500",
                          progress.status === "info" && "bg-blue-200 [&>div]:bg-blue-500",
                          progress.status === "indeterminate" && "animate-pulse",
                          progress.className
                        )}
                      />
                    </div>
                  )}
                </ToastContent>
              )}
              
              {/* Action buttons */}
              {(actions?.primary || actions?.secondary || footer) && (
                <ToastFooter>
                  {footer || (
                    <>
                      <div className="flex gap-2 ml-auto">
                        {actions?.secondary && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={actions.secondary.onClick}
                            className={actions.secondary.className}
                          >
                            {actions.secondary.label}
                          </Button>
                        )}
                        {actions?.primary && (
                          <Button 
                            size="sm" 
                            onClick={actions.primary.onClick}
                            className={actions.primary.className}
                          >
                            {actions.primary.label}
                          </Button>
                        )}
                      </div>
                    </>
                  )}
                </ToastFooter>
              )}
              
              {action}
            </Toast>
          )
        }

        // Regular toast
        return (
          <Toast key={id} variant={variant} {...props}>
            <div className="flex gap-3">
              {IconComponent && (
                <IconComponent 
                  className="h-5 w-5 shrink-0" 
                  aria-hidden="true" 
                />
              )}
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
