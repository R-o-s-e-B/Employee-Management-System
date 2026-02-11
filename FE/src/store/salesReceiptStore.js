import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  createSalesReceiptApi,
  getSalesReceiptsByOrgApi,
  updateSalesReceiptApi,
  deleteSalesReceiptApi,
} from "../api/salesReceiptApi";

export const useSalesReceiptStore = create(
  persist((set) => ({
    salesReceipts: [],
    loading: false,

    createSalesReceipt: async (params) => {
      set({ loading: true });
      try {
        const { result } = await createSalesReceiptApi(params);
        set((state) => ({
          salesReceipts: state.salesReceipts
            ? [...state.salesReceipts, result]
            : [result],
        }));
      } catch (err) {
        throw err;
      } finally {
        set({ loading: false });
      }
    },

    getSalesReceiptsByOrg: async ({ orgId, queryParams }) => {
      set({ loading: true });
      try {
        const { result } = await getSalesReceiptsByOrgApi({
          orgId,
          queryParams,
        });
        set({ salesReceipts: result });
      } catch (err) {
        throw err;
      } finally {
        set({ loading: false });
      }
    },

    updateSalesReceipt: async ({ receiptId, params }) => {
      set({ loading: true });
      try {
        const { result } = await updateSalesReceiptApi({
          receiptId,
          params,
        });
        set((state) => ({
          salesReceipts: state.salesReceipts.map((receipt) =>
            receipt._id === receiptId ? result : receipt,
          ),
        }));
      } catch (err) {
        throw err;
      } finally {
        set({ loading: false });
      }
    },

    deleteSalesReceipt: async ({ receiptId }) => {
      set({ loading: true });
      try {
        await deleteSalesReceiptApi({ receiptId });
        set((state) => ({
          salesReceipts: state.salesReceipts.filter(
            (receipt) => receipt._id !== receiptId,
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
