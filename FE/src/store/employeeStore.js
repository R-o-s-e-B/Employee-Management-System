import { create } from "zustand";
import {
  getEmployeesApi,
  createEmployeeApi,
  deleteEmployeeApi,
  updateEmployeeApi,
  updateEmployeeContactDetailsApi,
  updateEmployeeAttendanceApi,
  updateEmployeePayApi,
} from "../api/employeeApi";
import { persist } from "zustand/middleware";

export const useEmployeeStore = create(
  persist((set) => ({
    employeeData: null,
    allEmployees: [],
    loading: false,

    getEmployees: async (params) => {
      set({ loading: true });
      try {
        const { result } = await getEmployeesApi(params.deptId, params.orgId);
        set({ allEmployees: result });
      } catch (err) {
        throw err;
      } finally {
        set({ loading: false });
      }
    },

    createEmployee: async (params) => {
      set({ loading: true });
      try {
        const { result } = await createEmployeeApi(params);
        set((state) => ({
          allEmployees: [...state.allEmployees, result],
        }));
      } catch (err) {
        throw err;
      } finally {
        set({ loading: false });
      }
    },

    deleteEmployee: async (id) => {
      set({ loading: true });
      try {
        await deleteEmployeeApi(id);
        set((state) => ({
          allEmployees: state.allEmployees.filter((emp) => emp._id !== id),
        }));
      } catch (err) {
        throw err;
      } finally {
        set({ loading: false });
      }
    },

    updateEmployee: async (params) => {
      set({ loading: true });
      try {
        const { result } = await updateEmployeeApi(params);
        set({ employeeData: result });
      } catch (err) {
        throw err;
      } finally {
        set({ loading: false });
      }
    },

    updateContactDetails: async (params) => {
      set({ loading: true });
      try {
        const { result } = await updateEmployeeContactDetailsApi(params);
        set((state) => ({
          employeeData: {
            ...state.employeeData,
            contactInfo: result,
          },
        }));
      } catch (err) {
        throw err;
      } finally {
        set({ loading: false });
      }
    },

    updateEmployeeAttendance: async (params) => {
      set({ loading: true });
      try {
        const { result } = await updateEmployeeAttendanceApi(params);
        set((state) => ({
          employeeData: {
            ...state.employeeData,
            attendance: result,
          },
        }));
      } catch (err) {
        throw err;
      } finally {
        set({ loading: false });
      }
    },

    updateEmployeePayroll: async (params) => {
      set({ loading: true });
      try {
        const { payrollIds } = await updateEmployeePayApi(params);
        set((state) => ({
          employeeData: {
            ...state.employeeData,
            payrollIds,
          },
        }));
      } catch (err) {
        throw err;
      } finally {
        set({ loading: false });
      }
    },
  })),
);
