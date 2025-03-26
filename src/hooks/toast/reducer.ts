
import * as React from "react";
import { State, Action, actionTypes, ToasterToast } from "./types";

// Create a state that lives outside of React
export const memoryState: State = { toasts: [] };

export const listeners: ((state: State) => void)[] = [];

export const dispatch = (action: Action) => {
  memoryState.toasts = reducer(memoryState.toasts, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
};

const TOAST_LIMIT = 20;
const TOAST_REMOVE_DELAY = 1000000;

const reducer = (state: ToasterToast[], action: Action): ToasterToast[] => {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return [
        { ...action.toast, id: action.toast.id, open: true },
        ...state
      ].slice(0, TOAST_LIMIT);

    case actionTypes.UPDATE_TOAST:
      return state.map((t) =>
        t.id === action.toast.id ? { ...t, ...action.toast } : t
      );

    case actionTypes.DISMISS_TOAST: {
      // If there's a toast ID, dismiss a specific toast
      if (action.toastId) {
        return state.map((t) =>
          t.id === action.toastId
            ? {
                ...t,
                open: false,
              }
            : t
        );
      }

      // Dismiss all toasts
      return state.map((t) => ({
        ...t,
        open: false,
      }));
    }

    case actionTypes.REMOVE_TOAST: {
      if (action.toastId) {
        return state.filter((t) => t.id !== action.toastId);
      }

      return [];
    }
    
    default:
      return state;
  }
};

export const addToRemoveQueue = (toastId: string) => {
  if (memoryState.toasts.find((t) => t.id === toastId)?.open === false) {
    setTimeout(() => {
      dispatch({
        type: actionTypes.REMOVE_TOAST,
        toastId,
      });
    }, TOAST_REMOVE_DELAY);
  }
};
