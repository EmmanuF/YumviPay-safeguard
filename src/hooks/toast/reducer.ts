
import * as React from "react";
import { State, Action, ActionType, ToasterToast } from "./types";

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
    case ActionType.ADD_TOAST:
      return [action.toast, ...state].slice(0, TOAST_LIMIT);

    case ActionType.UPDATE_TOAST:
      return state.map((t) =>
        t.id === action.toast.id ? { ...t, ...action.toast } : t
      );

    case ActionType.DISMISS_TOAST: {
      const { toastId } = action;

      // If there's a toast ID, dismiss a specific toast
      if (toastId) {
        return state.map((t) =>
          t.id === toastId
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

    case ActionType.REMOVE_TOAST: {
      const { toastId } = action;

      if (toastId) {
        return state.filter((t) => t.id !== toastId);
      }

      return [];
    }
  }
};

export const addToRemoveQueue = (toastId: string) => {
  if (memoryState.toasts.find((t) => t.id === toastId)?.open === false) {
    setTimeout(() => {
      dispatch({
        type: ActionType.REMOVE_TOAST,
        toastId,
      });
    }, TOAST_REMOVE_DELAY);
  }
};
