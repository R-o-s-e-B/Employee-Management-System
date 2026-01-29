import { create } from "zustand";
import {
  getEmployeesApi,
  getEmployeeApi,
  createEmployeeApi,
  deleteEmployeeApi,
  updateEmployeeApi,
  updateEmployeeContactDetailsApi,
  updateEmployeeAttendanceApi,
  updateEmployeePayApi,
  getEmployeeAttendanceApi,
} from "../api/employeeApi";
import { persist } from "zustand/middleware";

export const useEmployeeStore = create(
  persist((set) => ({
    employeeData: null,
    allEmployees: [],
    loading: false,
    employeeAttendance: [],

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

    getEmployee: async (employeeId) => {
      set({ loading: true });
      try {
        const { employee } = await getEmployeeApi(employeeId);
        set({ employeeData: employee });
      } catch (err) {
        throw err;
      } finally {
        set({ loading: false });
      }
    },

    getEmployeeAttendance: async (employeeId) => {
      set({ loading: true });
      try {
        const { result } = await getEmployeeAttendanceApi(employeeId);
        set({ employeeAttendance: result });
      } catch (err) {
        console.log("Employee attendance fetching failed: ", err);
      } finally {
        set({ loading: false });
      }
    },

    updateEmployeeAttendance: async (params) => {
      set({ loading: true });
      try {
        const { result } = await updateEmployeeAttendanceApi(params);
        set((state) => ({
          employeeAttendance: {
            ...state.employeeAttendance,
            [new Date(date).toISOString().slice(0, 10)]: status,
          },
          loading: false,
        }));
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
