import axios from "axios";
import type {
  DashboardStats,
  Employee,
  EmployeeListParams,
  EmployeeListResponse,
  EmployeePayload,
} from "../types/types";

const API_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api";

// Dedicated Axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

export async function getEmployees(
  params?: EmployeeListParams,
): Promise<EmployeeListResponse> {
  const response = await apiClient.get<EmployeeListResponse>("/employees", {
    params,
  });
  return response.data;
}

export async function createEmployee(
  payload: EmployeePayload,
): Promise<Employee> {
  const response = await apiClient.post<Employee>("/employees", payload);
  return response.data;
}

export async function updateEmployee(
  id: number,
  payload: EmployeePayload,
): Promise<Employee> {
  const response = await apiClient.put<Employee>(`/employees/${id}`, payload);
  return response.data;
}

export async function deleteEmployee(id: number): Promise<void> {
  await apiClient.delete(`/employees/${id}`);
}

export async function getDashboard(): Promise<DashboardStats> {
  const response = await apiClient.get<DashboardStats>("/dashboard/stats");
  return response.data;
}
