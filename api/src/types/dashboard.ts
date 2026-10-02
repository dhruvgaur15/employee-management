export interface DepartmentChartData {
  department: string;
  count: number;
}

export interface StatusChartData {
  name: string;
  y: number;
}

export interface DashboardStats {
  byDepartment: DepartmentChartData[];
  byStatus: StatusChartData[];
  total: number;
}
