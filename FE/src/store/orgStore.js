import { create } from "zustand";
import { getOrgs, getUserOrg, createOrg, deleteOrg } from "../api/orgApi";
import { persist } from "zustand/middleware";

export const useOrgStore = create(
  persist((set) => ({
    orgId: null,
    orgName: null,
    loading: false,
    orgData: null,

    setActiveOrg: (orgId) => {
      console.log("setting active org: ", orgId);
      set({ orgId });
    },

    createOrg: async (params) => {
      set({ loading: true });
      try {
        const { result } = await createOrg(params);
        if (result) {
          set({ orgId: result._id, orgName: result.name });
        }
      } catch (err) {
        throw err;
      } finally {
        set({ loading: false });
      }
    },

    getAllOrgs: async (params) => {
      set({ loading: true });
      try {
        const { result } = await getOrgs(params);
        set({ orgData: result });
      } catch (err) {
        throw err;
      } finally {
        set({ loading: false });
      }
    },

    deleteOrg: async (params) => {
      set({ loading: true });
      try {
        await deleteOrg(params);
        set({ loading: false });
      } catch (err) {
        throw err;
        set({ loading: false });
      }
    },

    getUserOrgs: async (params) => {
      set({ loading: true });
      try {
        const { org } = await getUserOrg(params);
        set({
          orgData: org ? [org] : [],
          orgId: org?._id ?? null,
          orgName: org?.name ?? null,
        });
      } catch (err) {
        throw err;
      } finally {
        set({ loading: false });
      }
    },
  })),
);
