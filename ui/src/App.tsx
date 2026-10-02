import { Link, NavLink, Route, Routes } from "react-router-dom";
import { EmployeesPage } from "./pages/employee/EmployeesPage";
import { DashboardPage } from "./pages/dashboard/DashboardPage";
import { Toaster } from "react-hot-toast";

export function App() {
  return (
    <>
      <header className="app-header">
        <div className="container header-inner">
          <Link className="brand" to="/">
            Employee Management
          </Link>
          <nav>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Employees
            </NavLink>

            <NavLink
              to="/dashboard"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Dashboard
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="container page-content">
        <Routes>
          <Route path="/" element={<EmployeesPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </main>

      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
        }}
      />
    </>
  );
}
