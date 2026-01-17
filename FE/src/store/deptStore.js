import { create } from "zustand";
import { getDepts, createDept, deleteDept, editDept } from "../api/deptApi";
import { persist } from "zustand/middleware";

export const useDeptStore = create(
  persist((set) => ({
    deptId: null,
    deptName: null,
    loading: false,
    deptData: null,
    deptList: null,

    createDept: async (params) => {
      set({ loading: true });
      try {
        const { result } = await createDept(params);
        set({
          deptId: result._id,
          deptName: result.name,
          deptData: result,
        });
      } catch (err) {
        throw err;
      } finally {
        set({ loading: false });
      }
    },

    getAllDepts: async ({ orgId }) => {
      console.log("org id in store", orgId);
      set({ loading: true });
      try {
        const { result } = await getDepts(orgId);
        set({ deptList: result });
      } catch (err) {
        throw err;
      } finally {
        set({ loading: false });
      }
    },

    editDept: async (params) => {
      set({ loading: true });
      try {
        await editDept(params);
      } catch (err) {
        throw err;
      } finally {
        set({ loading: false });
      }
    },

    deleteDept: async (params) => {
      set({ loading: true });
      try {
        await deleteDept(params);
      } catch (err) {
        throw err;
      } finally {
        set({ loading: false });
      }
    },
  }))
);
