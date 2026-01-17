import { create } from "zustand";
import {
  getDeptsApi,
  createDeptApi,
  deleteDeptApi,
  editDeptApi,
} from "../api/deptApi";
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
        const { result } = await createDeptApi(params);
        set((state) => ({
          deptId: result._id,
          deptName: result.name,
          deptData: result,
          deptList: state.deptList ? [...state.deptList, result] : [result],
        }));
      } catch (err) {
        throw err;
      } finally {
        set({ loading: false });
      }
    },

    getAllDepts: async ({ orgId }) => {
      set({ loading: true });
      try {
        const { result } = await getDeptsApi(orgId);
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
        const { result } = await editDeptApi(params);
        set((state) => ({
          deptList: state.deptList.map((dept) =>
            dept._id === result._id ? result : dept,
          ),
        }));
      } catch (err) {
        throw err;
      } finally {
        set({ loading: false });
      }
    },

    deleteDept: async (params) => {
      set({ loading: true });
      try {
        await deleteDeptApi(params);
        set((state) => ({
          deptList: state.deptList.filter((dept) => dept._id !== params.deptId),
        }));
      } catch (err) {
        console.log("Delete failed: ", err);
        return false;
      } finally {
        set({ loading: false });
      }
    },
  })),
);
