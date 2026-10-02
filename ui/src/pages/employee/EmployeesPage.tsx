import { useState, useEffect, useCallback } from "react";
import { useEmployeeStore } from "../../stores/useEmployeeStore";
import { EmployeeForm } from "../../components/employees/EmployeeForm";
import { EmployeeTable } from "../../components/employees/EmployeeTable";
import { Modal } from "../../components/common/Modal";
import type {
  Employee,
  EmployeeListResponse,
  EmployeePayload,
} from "../../types/types";
import toast from "react-hot-toast";
import { departments, pageSizesOptions } from "../../utils/utils";
import { useDebounce } from "../../hooks/useDebounce";

export function EmployeesPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("");
  const [sortBy, setSortBy] = useState<keyof Employee>("emp_id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [deleting, setDeleting] = useState<Employee | null>(null);

  // Local UI states to replace React Query states
  const [data, setData] = useState<EmployeeListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { fetchEmployees, createEmployee, updateEmployee, deleteEmployee } =
    useEmployeeStore();

  const debouncedSearch = useDebounce(search, 400);

  const getEmployees = useCallback(() => {
    setIsLoading(true);
    setIsError(false);
    fetchEmployees(
      {
        page,
        pageSize,
        search: debouncedSearch,
        department,
        active: status === "" ? undefined : status === "true",
        sortBy,
        sortOrder,
      },
      (response: EmployeeListResponse) => {
        setData(response);
        setIsLoading(false);
      },
      () => {
        setIsError(true);
        setIsLoading(false);
      },
    );
  }, [
    page,
    pageSize,
    debouncedSearch,
    department,
    status,
    sortBy,
    sortOrder,
    fetchEmployees,
  ]);

  useEffect(() => {
    getEmployees();
  }, [getEmployees]);

  const handleSave = (payload: EmployeePayload) => {
    setIsSaving(true);
    if (editing) {
      updateEmployee(
        editing.emp_id,
        payload,
        () => {
          setIsSaving(false);
          closeForm();
          toast.success("Employee details updated successfully");
          getEmployees();
        },
        () => {
          setIsSaving(false);
          toast.error("An error occured while updating employee");
        },
      );
    } else {
      createEmployee(
        payload,
        () => {
          setIsSaving(false);
          closeForm();
          toast.success("Employee details added successfully");
          getEmployees();
        },
        () => {
          setIsSaving(false);
          toast.error("An error occured while adding employee");
        },
      );
    }
  };

  const handleRemove = (id: number) => {
    setIsDeleting(true);
    deleteEmployee(
      id,
      () => {
        setIsDeleting(false);
        setDeleting(null);
        toast.success("Employee deleted successfully");
        getEmployees();
      },
      () => {
        setIsDeleting(false);
        toast.error("An error occured while deleting employee");
      },
    );
  };

  const handleSort = (field: keyof Employee) => {
    setPage(1);
    if (field === sortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const openForm = (employee: Employee | null) => {
    setEditing(employee);
    setFormOpen(true);
  };

  const closeForm = () => {
    setEditing(null);
    setFormOpen(false);
  };

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Management</p>
          <h1>Employees</h1>
          <p className="muted">
            Manage employee records, status and departments.
          </p>
        </div>
        <button
          className="button button-primary"
          onClick={() => openForm(null)}
        >
          Add Employee
        </button>
      </div>

      <div className="card">
        <div className="filters">
          <input
            placeholder="Search by ID or name…"
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
          />
          <select
            value={department}
            onChange={(e) => {
              setPage(1);
              setDepartment(e.target.value);
            }}
          >
            <option value="">All departments</option>
            {departments.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => {
              setPage(1);
              setStatus(e.target.value);
            }}
          >
            <option value="">All statuses</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        {isLoading && <div className="state-message">Loading employees…</div>}
        {isError && (
          <div className="state-message error-message">
            Unable to load employees.
          </div>
        )}

        {data && !isLoading && !isError && (
          <>
            <EmployeeTable
              employees={data.data}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={handleSort}
              onEdit={openForm}
              onDelete={setDeleting}
            />

            {data.pagination.totalPages ? (
              <div className="pagination">
                <button
                  className="button"
                  disabled={page === 1}
                  onClick={() => {
                    setPage(page - 1);
                  }}
                >
                  Previous
                </button>
                <select
                  className="button"
                  onChange={(e) => {
                    setPage(1);
                    setPageSize(Number(e.target.value));
                  }}
                  value={pageSize}
                >
                  {pageSizesOptions.map((item: number) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <span>
                  Page {page} of {data.pagination.totalPages}
                </span>
                <button
                  className="button"
                  disabled={page === data.pagination.totalPages}
                  onClick={() => {
                    setPage(page + 1);
                  }}
                >
                  Next
                </button>
              </div>
            ) : (
              <></>
            )}
          </>
        )}
      </div>

      {formOpen && (
        <Modal
          title={editing ? "Edit Employee" : "Add Employee"}
          onClose={closeForm}
        >
          <EmployeeForm
            employee={editing}
            isSaving={isSaving}
            onSubmit={handleSave}
            onCancel={closeForm}
          />
        </Modal>
      )}

      {deleting && (
        <Modal
          title="Delete employee?"
          small
          onClose={() => {
            setDeleting(null);
          }}
        >
          <p className="muted">
            Are you sure you want to delete the user{" "}
            <strong>{deleting.name}</strong>?
          </p>
          <div className="form-actions">
            <button
              className="button"
              onClick={() => {
                setDeleting(null);
              }}
            >
              No
            </button>
            <button
              className="button button-danger"
              disabled={isDeleting}
              onClick={() => handleRemove(deleting.emp_id)}
            >
              {isDeleting ? "Deleting…" : "Yes, Delete"}
            </button>
          </div>
        </Modal>
      )}
    </section>
  );
}
