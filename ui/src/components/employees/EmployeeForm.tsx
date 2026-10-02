import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Employee, EmployeePayload } from "../../types/types";
import { departments, formatDateForInput } from "../../utils/utils";
import { schema, type FormValues } from "../../schemas/employeeSchema";

interface EmployeeFormProps {
  employee?: Employee | null;
  isSaving: boolean;
  onSubmit: (payload: EmployeePayload) => void;
  onCancel: () => void;
}

export function EmployeeForm({
  employee,
  isSaving,
  onSubmit,
  onCancel,
}: EmployeeFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: employee?.name ?? "",
      salary: employee?.salary ?? 0,
      department: employee?.department ?? "",
      joining_date: formatDateForInput(employee?.joining_date) ?? "",
      departure_date: formatDateForInput(employee?.departure_date) ?? "",
      active: employee?.active ?? true,
    },
  });

  const submit = (values: FormValues) => {
    onSubmit({ ...values, departure_date: values.departure_date || null });
  };

  return (
    <form className="employee-form" onSubmit={handleSubmit(submit)}>
      <label>
        Name
        <input {...register("name")} placeholder="Enter employee name" />
        {errors.name && <small>{errors.name.message}</small>}
      </label>

      <label>
        Salary
        <input
          type="number"
          min="0"
          {...register("salary")}
          placeholder="Enter salary"
        />
        {errors.salary && <small>{errors.salary.message}</small>}
      </label>

      <label>
        Department
        <select {...register("department")}>
          <option value="" disabled>
            Select a department
          </option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
        {errors.department && (
          <small style={{ color: "red" }}>{errors.department.message}</small>
        )}
      </label>

      <label>
        Joining Date
        <input type="date" {...register("joining_date")} />
        {errors.joining_date && <small>{errors.joining_date.message}</small>}
      </label>

      <label>
        Departure Date
        <input type="date" {...register("departure_date")} />
        {errors.departure_date && (
          <small>{errors.departure_date.message}</small>
        )}
      </label>

      <label className="checkbox-label">
        <input type="checkbox" {...register("active")} />
        Active employee
      </label>

      <div className="form-actions">
        <button type="button" className="button" onClick={onCancel}>
          Cancel
        </button>
        <button
          type="submit"
          className="button button-primary"
          disabled={isSaving}
        >
          {isSaving ? "Saving…" : employee ? "Save Changes" : "Add Employee"}
        </button>
      </div>
    </form>
  );
}
