
import { State, Action, actionTypes } from "./types"

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 5000 // Default 5 seconds for standard toasts

// Track toast timeouts so we can cancel them
const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

export const addToRemoveQueue = (toastId: string, delay?: number) => {
  if (toastTimeouts.has(toastId)) {
    clearTimeout(toastTimeouts.get(toastId))
    toastTimeouts.delete(toastId)
  }

  // If autoClose is false, don't add to the remove queue
  const toast = memoryState.toasts.find(t => t.id === toastId)
  if (toast?.autoClose === false) return
  
  // Use custom duration or default
  const duration = toast?.duration || TOAST_REMOVE_DELAY

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, delay || duration)

  toastTimeouts.set(toastId, timeout)
}

// Manage listeners for the reducer
export const listeners: Array<(state: State) => void> = []

// Initialize memory state
export let memoryState: State = { toasts: [] }

// Create a dispatch function that updates state and notifies listeners
export function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

// Reducer function to handle state updates
export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      // If toast has autoClose property not set, default to true
      if (action.toast.autoClose === undefined) {
        action.toast.autoClose = true
      }
      
      // Auto-add to remove queue if autoClose is true
      if (action.toast.autoClose) {
        addToRemoveQueue(action.toast.id, action.toast.duration)
      }
      
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) => {
          if (t.id === action.toast.id) {
            // If progress is updated, don't automatically dismiss
            if (action.toast.progress && action.toast.progress.value !== undefined) {
              // If progress reaches 100%, auto dismiss after delay
              if (action.toast.progress.value >= 100 && t.autoClose) {
                addToRemoveQueue(t.id, 1000) // Dismiss after 1 second when complete
              }
            }
            
            return { ...t, ...action.toast }
          }
          return t
        }),
      }

    case actionTypes.DISMISS_TOAST: {
      const { toastId } = action

      // Side effects - Add toast to remove queue
      if (toastId) {
        addToRemoveQueue(toastId, 100) // Quick dismiss
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id, 100) // Quick dismiss
        })
      }

      // Call onDismiss callback if defined
      if (toastId) {
        const toast = state.toasts.find(t => t.id === toastId)
        if (toast?.onDismiss) {
          toast.onDismiss()
        }
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }
    case actionTypes.REMOVE_TOAST:
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}
