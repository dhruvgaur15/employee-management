import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { EmployeeForm } from "./EmployeeForm";
import type { Employee } from "../../types/types";

describe("EmployeeForm", () => {
  const onSubmit = vi.fn();
  const onCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the form fields", () => {
    render(
      <EmployeeForm isSaving={false} onSubmit={onSubmit} onCancel={onCancel} />,
    );

    expect(
      screen.getByPlaceholderText("Enter employee name"),
    ).toBeInTheDocument();

    expect(screen.getByPlaceholderText("Enter salary")).toBeInTheDocument();

    expect(screen.getByText("Department")).toBeInTheDocument();
    expect(screen.getByText("Joining Date")).toBeInTheDocument();
    expect(screen.getByText("Departure Date")).toBeInTheDocument();
    expect(screen.getByText("Active employee")).toBeInTheDocument();
  });

  it("shows Add Employee button for a new employee", () => {
    render(
      <EmployeeForm isSaving={false} onSubmit={onSubmit} onCancel={onCancel} />,
    );

    const buttons = screen.getAllByRole("button", { name: "Add Employee" });
    expect(buttons[0]).toBeInTheDocument();
  });

  it("shows Save Changes button when editing", () => {
    const employee = {
      emp_id: 1,
      name: "John Doe",
      salary: 50000,
      department: "Engineering",
      joining_date: "2024-01-15",
      departure_date: null,
      active: true,
    } as Employee;

    render(
      <EmployeeForm
        employee={employee}
        isSaving={false}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />,
    );

    expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Save Changes" }),
    ).toBeInTheDocument();
  });

  it("calls onCancel when Cancel is clicked", async () => {
    const user = userEvent.setup();

    render(
      <EmployeeForm isSaving={false} onSubmit={onSubmit} onCancel={onCancel} />,
    );

    const buttons = screen.getAllByRole("button", { name: "Cancel" });
    await user.click(buttons[0]);

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("disables submit button while saving", () => {
    render(
      <EmployeeForm isSaving={true} onSubmit={onSubmit} onCancel={onCancel} />,
    );

    const button = screen.getAllByRole("button", {
      name: "Saving…",
    });

    expect(button[0]).toBeDisabled();
  });

  it("shows entered employee name", async () => {
    const user = userEvent.setup();

    render(
      <EmployeeForm isSaving={false} onSubmit={onSubmit} onCancel={onCancel} />,
    );

    const nameInput = screen.getAllByPlaceholderText("Enter employee name");

    await user.type(nameInput[0], "John Doe");

    expect(nameInput[0]).toHaveValue("John Doe");
  });

  it("allows changing the active checkbox", async () => {
    const user = userEvent.setup();

    render(
      <EmployeeForm isSaving={false} onSubmit={onSubmit} onCancel={onCancel} />,
    );

    const checkbox = screen.getAllByRole("checkbox");

    expect(checkbox[0]).toBeChecked();

    await user.click(checkbox[0]);

    expect(checkbox[0]).not.toBeChecked();
  });
});
