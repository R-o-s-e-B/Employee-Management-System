import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  createExpenseApi,
  getExpensesByOrgApi,
  updateExpenseApi,
  deleteExpenseApi,
} from "../api/expenseApi";

export const useExpenseStore = create(
  persist((set) => ({
    expenses: [],
    loading: false,

    createExpense: async (params) => {
      set({ loading: true });
      try {
        const { result } = await createExpenseApi(params);
        set((state) => ({
          expenses: state.expenses ? [...state.expenses, result] : [result],
        }));
      } catch (err) {
        throw err;
      } finally {
        set({ loading: false });
      }
    },

    getExpensesByOrg: async ({ orgId }) => {
      set({ loading: true });
      try {
        const { result } = await getExpensesByOrgApi({ orgId });
        set({ expenses: result });
      } catch (err) {
        throw err;
      } finally {
        set({ loading: false });
      }
    },

    updateExpense: async ({ orgId, expenseId, params }) => {
      set({ loading: true });
      try {
        const { result } = await updateExpenseApi({ orgId, expenseId, params });
        set((state) => ({
          expenses: state.expenses.map((expense) =>
            expense._id === expenseId ? result : expense,
          ),
        }));
      } catch (err) {
        throw err;
      } finally {
        set({ loading: false });
      }
    },

    deleteExpense: async ({ orgId, expenseId }) => {
      set({ loading: true });
      try {
        await deleteExpenseApi({ orgId, expenseId });
        set((state) => ({
          expenses: state.expenses.filter(
            (expense) => expense._id !== expenseId,
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
