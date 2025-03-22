
import { Toast, ToasterToast } from "./types"
import { dispatch } from "./reducer"

// Generate unique IDs for toasts
let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

// Base toast function
export function toast({ ...props }: Toast) {
  const id = genId()

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
    
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id,
    dismiss,
    update,
  }
}

// Add variant convenience methods
toast.info = (title: string, props?: Omit<Toast, "title" | "variant">) => 
  toast({ title, ...props, variant: "info" });

toast.success = (title: string, props?: Omit<Toast, "title" | "variant">) => 
  toast({ title, ...props, variant: "success" });

toast.warning = (title: string, props?: Omit<Toast, "title" | "variant">) => 
  toast({ title, ...props, variant: "warning" });

toast.error = (title: string, props?: Omit<Toast, "title" | "variant">) => 
  toast({ title, ...props, variant: "destructive" });

