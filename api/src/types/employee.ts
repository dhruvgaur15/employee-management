export interface Employee {
  emp_id?: number;
  name: string;
  salary: number;
  department: string;
  joining_date: string;
  departure_date: string | null;
  active: boolean | number;
}

export interface EmployeeQuery {
  page?: string;
  pageSize?: string;
  sortBy?: string;
  sortOrder?: string;
  search?: string;
  department?: string;
  active?: string;
}
