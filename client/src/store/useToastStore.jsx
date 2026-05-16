import { create } from "zustand";

export const useToastStore = create((set) => ({
    toasts: [],

    addToast: (toast) =>
        set((state) => {
            const exists = state.toasts.some(
                (t) => t.message === toast.message
            );

            if (exists) return state;

            const newToast = {
                id: crypto.randomUUID(),
                ...toast
            };

            return {
                toasts: [...state.toasts, newToast].slice(-3)
            };
        }),

    removeToast: (id) =>
        set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id)
        }))
}));