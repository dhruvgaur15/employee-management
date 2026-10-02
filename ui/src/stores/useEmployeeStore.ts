import { create } from "zustand";
import * as api from "../api/api";
import type {
  DashboardStats,
  Employee,
  EmployeeListParams,
  EmployeeListResponse,
  EmployeePayload,
} from "../types/types";

interface EmployeeStoreState {
  fetchEmployees: (
    params: EmployeeListParams,
    successCallback?: (data: EmployeeListResponse) => void,
    errorCallback?: (error: unknown) => void,
  ) => Promise<void>;

  createEmployee: (
    payload: EmployeePayload,
    successCallback?: (data: Employee) => void,
    errorCallback?: (error: unknown) => void,
  ) => Promise<void>;

  updateEmployee: (
    id: number,
    payload: EmployeePayload,
    successCallback?: (data: Employee) => void,
    errorCallback?: (error: unknown) => void,
  ) => Promise<void>;

  deleteEmployee: (
    id: number,
    successCallback?: () => void,
    errorCallback?: (error: unknown) => void,
  ) => Promise<void>;

  getDashboardStats: (
    successCallback?: (data: DashboardStats) => void,
    errorCallback?: (error: unknown) => void,
  ) => Promise<void>;
}

export const useEmployeeStore = create<EmployeeStoreState>(() => ({
  fetchEmployees: async (params, successCallback, errorCallback) => {
    try {
      const response = await api.getEmployees(params);
      successCallback?.(response);
    } catch (error: unknown) {
      errorCallback?.(error);
    }
  },

  createEmployee: async (payload, successCallback, errorCallback) => {
    try {
      const response = await api.createEmployee(payload);
      successCallback?.(response);
    } catch (error: unknown) {
      errorCallback?.(error);
    }
  },

  updateEmployee: async (id, payload, successCallback, errorCallback) => {
    try {
      const response = await api.updateEmployee(id, payload);
      successCallback?.(response);
    } catch (error: unknown) {
      errorCallback?.(error);
    }
  },

  deleteEmployee: async (id, successCallback, errorCallback) => {
    try {
      await api.deleteEmployee(id);
      successCallback?.();
    } catch (error: unknown) {
      errorCallback?.(error);
    }
  },

  getDashboardStats: async (successCallback, errorCallback) => {
    try {
      const response = await api.getDashboard();
      successCallback?.(response);
    } catch (error: unknown) {
      errorCallback?.(error);
    }
  },
}));
