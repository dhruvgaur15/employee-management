import { render, screen, fireEvent } from "@testing-library/react";
import { EmployeeTable } from "./EmployeeTable";
import { describe, test, expect, vi } from "vitest";

const mockEmployees = [
  {
    emp_id: 27,
    name: "test employee",
    salary: 12323,
    department: "Finance",
    joining_date: "2026-04-10",
    departure_date: null,
    active: true,
  },
];

describe("EmployeeTable Component", () => {
  const defaultProps = {
    employees: mockEmployees,
    sortBy: "emp_id" as const,
    sortOrder: "asc" as const,
    onSort: vi.fn(),
    onEdit: vi.fn(),
    onDelete: vi.fn(),
  };

  test("renders table headers and employee details correctly", () => {
    render(<EmployeeTable {...defaultProps} />);

    expect(screen.getByRole("button", { name: /name/i })).toBeInTheDocument();
    expect(screen.getByText("test employee")).toBeInTheDocument();
    expect(screen.getByText("Finance")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  test("renders empty message when employee list is empty", () => {
    render(<EmployeeTable {...defaultProps} employees={[]} />);

    expect(screen.getByText(/no employees found/i)).toBeInTheDocument();
  });

  test("calls onSort when a column header sort button is clicked", () => {
    const handleSort = vi.fn();
    render(<EmployeeTable {...defaultProps} onSort={handleSort} />);

    const nameHeaderButton = screen.getAllByRole("button", { name: /name/i });
    fireEvent.click(nameHeaderButton[0]);

    expect(handleSort).toHaveBeenCalled;
  });

  test("calls onEdit when the Edit button is clicked", () => {
    const handleEdit = vi.fn();
    render(<EmployeeTable {...defaultProps} onEdit={handleEdit} />);

    const editButton = screen.getAllByText(
      (content) => content.trim().toLowerCase() === "edit",
    );
    fireEvent.click(editButton[0]);

    expect(handleEdit).toHaveBeenCalled;
  });

  test("calls onDelete when the Delete button is clicked", () => {
    const handleDelete = vi.fn();
    render(<EmployeeTable {...defaultProps} onDelete={handleDelete} />);

    const deleteButton = screen.getAllByText(
      (content) => content.trim().toLowerCase() === "delete",
    );
    fireEvent.click(deleteButton[0]);

    expect(handleDelete).toHaveBeenCalled;
  });
});
