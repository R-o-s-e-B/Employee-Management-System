import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  createPositionApi,
  getPositionsApi,
  deletePositionApi,
} from "../api/positionApi";

export const usePositionsStore = create(
  persist((set) => ({
    positions: null,
    loading: false,

    createPosition: async (params) => {
      set({ loading: true });
      try {
        const { data } = await createPositionApi(params);
        set((state) => ({
          ...state,
          data,
        }));
      } catch (err) {
        throw err;
      } finally {
        set({ loading: false });
      }
    },

    getPositions: async ({ orgId }) => {
      set({ loading: true });
      try {
        const { data } = await getPositionsApi(orgId);
        set({ positions: data });
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
          positions: state.positions.filter(
            (position) => position._id !== params.id,
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
