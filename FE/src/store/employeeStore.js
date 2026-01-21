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
    allEmployees: null,
    loading: false,

    getEmployees: async (params) => {
      set({ loading: true });
      try {
        const { data } = await getEmployeesApi(params.deptId, params.orgId);
        set({ allEmployees: data });
      } catch (err) {
        throw err;
      } finally {
        set({ loading: false });
      }
    },

    createEmployee: async (params) => {
      set({ loading: true });
      try {
        const { data } = await createEmployeeApi(params);
        set({ employeeData: data });
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
        console.log("Employee has been deleted, id: ", id);
      } catch (err) {
        throw err;
      } finally {
        set({ loading: false });
      }
    },

    updateEmployee: async (params) => {
      set({ loading: true });
      try {
        const { result } = updateEmployeeApi(params);
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
