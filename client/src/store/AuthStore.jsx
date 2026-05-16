import { create } from "zustand";

export const useAuthStore = create((set) => ({
    user: null,
    isAuth: false,
    loading: true,

    setUser: (user) => set({ user, isAuth: true }),
    logout: () => set({ user: null, isAuth: false }),
    setLoading: (loading) => set({ loading }),
}));