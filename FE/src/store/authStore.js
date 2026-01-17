import { create } from "zustand";
import { persist } from "zustand/middleware";
import { loginApi, logoutApi, signupApi } from "../api/authApi";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      loading: false,

      login: async (credentials) => {
        set({ loading: true });
        try {
          const { user, token } = await loginApi(credentials);
          set({ user, token, loading: false });
        } catch (err) {
          set({ loading: false });
          throw err;
        }
      },

      signup: async (credentials) => {
        set({ loading: true });
        try {
          const data = await signupApi(credentials);
          set({ user: data.user, loading: false });
          return data;
        } catch (err) {
          set({ loading: false });
          throw err;
        }
      },

      logout: async () => {
        await logoutApi();
        set({ user: null, token: null });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);
