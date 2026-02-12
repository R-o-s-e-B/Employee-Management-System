import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  createAccountApi,
  getAccountsApi,
} from "../api/accountApi";

export const useAccountStore = create(
  persist((set) => ({
    accounts: [],
    loading: false,

    createAccount: async (params) => {
      set({ loading: true });
      try {
        const { result } = await createAccountApi(params);
        set((state) => ({
          accounts: state.accounts ? [...state.accounts, result] : [result],
        }));
      } catch (err) {
        throw err;
      } finally {
        set({ loading: false });
      }
    },

    getAccounts: async ({ orgId }) => {
      set({ loading: true });
      try {
        const { result } = await getAccountsApi({ orgId });
        set({ accounts: result });
      } catch (err) {
        throw err;
      } finally {
        set({ loading: false });
      }
    },
  })),
);
