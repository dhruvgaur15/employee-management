import type { Employee } from "../../types/types";
import { formatDate } from "../../utils/utils";

interface EmployeeTableProps {
  employees: Employee[];
  sortBy: keyof Employee;
  sortOrder: "asc" | "desc";
  onSort: (field: keyof Employee) => void;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

const columns: { key: keyof Employee; label: string }[] = [
  { key: "emp_id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "salary", label: "Salary" },
  { key: "department", label: "Department" },
  { key: "joining_date", label: "Joining Date" },
  { key: "departure_date", label: "Departure Date" },
  { key: "active", label: "Status" },
];

export function EmployeeTable({
  employees,
  sortBy,
  sortOrder,
  onSort,
  onEdit,
  onDelete,
}: EmployeeTableProps) {
  const arrow = (key: keyof Employee) =>
    key !== 'departure_date' && (sortBy !== key ? " ↕" : sortOrder === "asc" ? " ↑" : " ↓");

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {columns.map(({ key, label }) => (
              <th key={key}>
                <button className="sort-button" onClick={() => onSort(key)}>
                  {label}
                  {arrow(key)}
                </button>
              </th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {employees.length === 0 && (
            <tr>
              <td colSpan={8} className="empty-cell">
                No employees found.
              </td>
            </tr>
          )}

          {employees.map((employee) => (
            <tr key={employee.emp_id}>
              <td>{employee.emp_id}</td>
              <td>{employee.name}</td>
              <td>₹{Number(employee.salary).toLocaleString("en-IN")}</td>
              <td>{employee.department}</td>
              <td>{formatDate(employee.joining_date)}</td>
              <td>
                {employee.departure_date
                  ? formatDate(employee.departure_date)
                  : "—"}
              </td>
              <td>
                <span
                  className={`status ${employee.active ? "status-active" : "status-inactive"}`}
                >
                  {employee.active ? "Active" : "Inactive"}
                </span>
              </td>
              <td>
                <div className="row-actions">
                  <button
                    className="link-button"
                    onClick={() => onEdit(employee)}
                  >
                    Edit
                  </button>
                  <button
                    className="link-button danger"
                    onClick={() => onDelete(employee)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
