import { create } from "zustand";
import { getOrgs, getUserOrg, createOrg, deleteOrg } from "../api/orgApi";
import { persist } from "zustand/middleware";

export const useOrgStore = create(
  persist((set) => ({
    orgId: null,
    orgName: null,
    loading: false,
    orgData: null,

    createOrg: async (params) => {
      set({ loading: true });
      try {
        const { newOrg } = await createOrg(params);
        set({ orgId: newOrg.orgId, orgName: newOrg.name });
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
        const { orgs } = await getUserOrg(params);
        set({ orgData: orgs, orgId: orgData._id });
      } catch (err) {
        throw err;
        set({ loading: false });
      }
    },
  })),
);
