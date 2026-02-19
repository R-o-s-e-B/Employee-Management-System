import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  createItemsApi,
  getItemsApi,
  updateItemApi,
  deleteItemApi,
} from "../api/itemApi";

export const useItemStore = create(
  persist((set) => ({
    items: [],
    loading: false,

    createItems: async (params) => {
      set({ loading: true });
      try {
        const { result } = await createItemsApi(params);
        set((state) => ({
          items: state.items ? [...state.items, ...result] : result,
        }));
      } catch (err) {
        throw err;
      } finally {
        set({ loading: false });
      }
    },

    getItems: async (orgId) => {
      set({ loading: true });
      try {
        const { result } = await getItemsApi(orgId);
        set({ items: result });
      } catch (err) {
        throw err;
      } finally {
        set({ loading: false });
      }
    },

    updateItem: async ({ itemId, params }) => {
      set({ loading: true });
      try {
        const { result } = await updateItemApi({ itemId, params });
        set((state) => ({
          items: state.items.map((item) =>
            item._id === itemId ? result : item,
          ),
        }));
      } catch (err) {
        throw err;
      } finally {
        set({ loading: false });
      }
    },

    deleteItem: async ({ itemId, orgId }) => {
      set({ loading: true });
      try {
        await deleteItemApi({ itemId, orgId });
        set((state) => ({
          items: state.items.filter((item) => item._id !== itemId),
        }));
      } catch (err) {
        throw err;
      } finally {
        set({ loading: false });
      }
    },
  })),
);
