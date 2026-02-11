import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  createCategoriesApi,
  getCategoriesApi,
  updateCategoryApi,
  deleteCategoryApi,
} from "../api/categoryApi";

export const useCategoryStore = create(
  persist((set) => ({
    categories: [],
    loading: false,

    createCategory: async (params) => {
      set({ loading: true });
      try {
        const { result } = await createCategoriesApi(params);
        set((state) => ({
          categories: state.categories
            ? [...state.categories, ...result]
            : result,
        }));
      } catch (err) {
        throw err;
      } finally {
        set({ loading: false });
      }
    },

    getCategories: async ({ orgId }) => {
      set({ loading: true });
      try {
        const { result } = await getCategoriesApi({ orgId });
        set({ categories: result });
      } catch (err) {
        throw err;
      } finally {
        set({ loading: false });
      }
    },

    updateCategory: async ({ orgId, categoryId, params }) => {
      set({ loading: true });
      try {
        const { result } = await updateCategoryApi({ orgId, categoryId, params });
        set((state) => ({
          categories: state.categories.map((category) =>
            category._id === categoryId ? result : category,
          ),
        }));
      } catch (err) {
        throw err;
      } finally {
        set({ loading: false });
      }
    },

    deleteCategory: async ({ orgId, categoryId }) => {
      set({ loading: true });
      try {
        await deleteCategoryApi({ orgId, categoryId });
        set((state) => ({
          categories: state.categories.filter(
            (category) => category._id !== categoryId,
          ),
        }));
      } catch (err) {
        throw err;
      } finally {
        set({ loading: false });
      }
    },
  })),
);
