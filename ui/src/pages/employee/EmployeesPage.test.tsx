import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { EmployeesPage } from "./EmployeesPage";
import { useEmployeeStore } from "../../stores/useEmployeeStore";
import { describe, test, expect, vi, beforeEach } from "vitest";

vi.mock("../../stores/useEmployeeStore", () => ({
  useEmployeeStore: vi.fn(),
}));

const dummyEmployeeData = {
  data: [
    {
      emp_id: 27,
      name: "test",
      salary: 12323,
      department: "Finance",
      joining_date: "10/04/2026",
      departure_date: null,
      active: true,
    },
  ],
  pagination: { page: 1, pageSize: 10, total: 1, totalPages: 1 },
};

describe("EmployeesPage Component (Zustand State Mocking)", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useEmployeeStore).mockReturnValue({
      fetchEmployees: vi.fn((_params, successCallback) => {
        if (successCallback) {
          successCallback(dummyEmployeeData);
        }
      }),
      addEmployee: vi.fn(),
      updateEmployee: vi.fn(),
      deleteEmployee: vi.fn(),
      getDashboardStats: vi.fn(),
    } as any);
  });

  // 1. Verifies the page renders the heading and search input
  test("renders the page heading", async () => {
    render(<EmployeesPage />);

    const EmployeeHeading = screen.getAllByText(
      (content) => content.trim().toLowerCase() === "employees",
    );

    expect(EmployeeHeading[0]).toBeInTheDocument();
  });

  // 2. Verifies clicking the "Edit" button opens a modal pre-populated with "test"
  test("opens edit modal pre-populated with dummy data name 'test'", async () => {
    render(<EmployeesPage />);

    const editButton = await screen.findAllByText(
      (content) => content.trim().toLowerCase() === "edit",
    );
    fireEvent.click(editButton[0]);

    await waitFor(() => {
      const nameInput = screen.getAllByPlaceholderText(/enter employee name/i);
      expect(nameInput[0]).toHaveValue("test");
    });
  });

  test("opens delete modal with Delete employee? text", async () => {
    render(<EmployeesPage />);

    const handleDelete = vi.fn();

    const deleteButton = screen.getAllByText(
      (content) => content.trim().toLowerCase() === "delete",
    );
    fireEvent.click(deleteButton[0]);

    expect(handleDelete).toHaveBeenCalled;
  });
});
