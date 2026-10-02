export interface Employee {
  emp_id: number;
  name: string;
  salary: number;
  department: string;
  joining_date: string;
  departure_date: string | null;
  active: boolean;
}

export type EmployeePayload = Omit<Employee, "emp_id">;

export interface EmployeeListParams {
  page: number;
  pageSize: number;
  search?: string;
  department?: string;
  active?: boolean;
  sortBy?: keyof Employee;
  sortOrder?: "asc" | "desc";
}

export interface EmployeeListResponse {
  data: Employee[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface DashboardStats {
  total: number;
  byDepartment: { department: string; count: number }[];
  byStatus: {
    name: "Active" | "Inactive";
    y: number;
  }[];
}
