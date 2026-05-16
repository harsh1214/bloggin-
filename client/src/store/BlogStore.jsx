import { create } from "zustand";
import api from "../api/axios";

export const useBlogStore = create((set) => ({
    mostViewed: [],
    recentBlogs: [],

    loadingMostViewed: false,
    loadingRecentBlogs: false,

    fetchMostViewed: async () => {
        set({ loadingMostViewed: true });

        try {
            const { data } = await api.get('/blog/popular');
            set({ mostViewed: data.data });
        } catch (error) {
            console.log(error);
        } finally {
            set({ loadingMostViewed: false });
        }
    },

    fetchRecentBlogs: async () => {
        set({ loadingRecentBlogs: true });

        try {
            const { data } = await api.get('/blog/recent');
            set({ recentBlogs: data.data });
        } catch (error) {
            console.log(error);
        } finally {
            set({ loadingRecentBlogs: false });
        }
    }
}));