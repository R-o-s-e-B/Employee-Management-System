import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  createPositionApi,
  getPositionsApi,
  deletePositionApi,
} from "../api/positionApi";

export const usePositionStore = create(
  persist((set) => ({
    positions: [],
    loading: false,

    createPosition: async (params) => {
      set({ loading: true });
      try {
        const { result } = await createPositionApi(params);
        set((state) => ({
          positions: state.positions ? [...state.positions, result] : [result],
        }));
      } catch (err) {
        throw err;
      } finally {
        set({ loading: false });
      }
    },

    getPositions: async (orgId) => {
      set({ loading: true });
      try {
        const { result } = await getPositionsApi(orgId);
        set({ positions: result });
      } catch (err) {
        throw err;
      } finally {
        set({ loading: false });
      }
    },

    deletePosition: async ({ id }) => {
      set({ loading: true });
      try {
        await deletePositionApi(id);
        set((state) => ({
          positions: state.positions.filter((position) => position._id !== id),
        }));
      } finally {
        set({ loading: false });
      }
    },
  })),
);
