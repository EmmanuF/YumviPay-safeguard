
import * as React from "react"
import type { ToastActionElement, ToastProps } from "@/components/ui/toast"

export type ToastVariant = "default" | "destructive" | "success" | "info" | "warning" | "interactive"

export interface ToastProgress {
  value: number
  max?: number
  showValue?: boolean
  className?: string
  status?: 'indeterminate' | 'success' | 'error' | 'warning' | 'info'
}

export interface ToastActions {
  primary?: {
    label: string
    onClick: () => void
    className?: string
  }
  secondary?: {
    label: string
    onClick: () => void
    className?: string
  }
}

export type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
  variant?: ToastVariant
  // New interactive properties
  progress?: ToastProgress
  actions?: ToastActions
  custom?: React.ReactNode
  autoClose?: boolean
  duration?: number
  animation?: string
  onDismiss?: () => void
  footer?: React.ReactNode
}

export interface State {
  toasts: ToasterToast[]
}

export const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

export type ActionType = typeof actionTypes

export type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"]
    }

export type Toast = Omit<ToasterToast, "id">
