import { useState, useEffect, useCallback } from "react";
import { useEmployeeStore } from "../../stores/useEmployeeStore";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import type { DashboardStats } from "../../types/types";

export function DashboardPage() {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const { getDashboardStats } = useEmployeeStore();

  const loadDashboard = useCallback(() => {
    setIsLoading(true);
    setIsError(false);
    getDashboardStats(
      (stats) => {
        setData(stats);
        setIsLoading(false);
      },
      () => {
        setIsError(true);
        setIsLoading(false);
      },
    );
  }, [getDashboardStats]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  if (isLoading) {
    return <div className="state-message">Loading dashboard…</div>;
  }

  if (isError || !data)
    return (
      <div className="state-message error-message">
        Unable to load dashboard.
      </div>
    );

  const active = data.byStatus.find((s) => s.name === "Active")?.y ?? 0;
  const inactive = data.byStatus.find((s) => s.name === "Inactive")?.y ?? 0;

  const departmentChart: Highcharts.Options = {
    title: { text: "" },
    credits: { enabled: false },
    xAxis: { categories: data.byDepartment.map((d) => d.department) },
    yAxis: { title: { text: "Employees" } },
    series: [
      {
        type: "column",
        name: "Employees",
        data: data.byDepartment.map((d) => d.count),
      },
    ],
  };

  const statusChart: Highcharts.Options = {
    title: { text: "" },
    credits: { enabled: false },
    series: [
      {
        type: "pie",
        name: "Employees",
        data: [
          { name: "Active", y: active },
          { name: "Inactive", y: inactive },
        ],
      },
    ],
  };

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Analytics</p>
          <h1>Dashboard</h1>
          <p className="muted">Employee overview and department statistics.</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card stat-card">
          <span>Total Employees</span>
          <strong>{data.total}</strong>
        </div>
        <div className="card stat-card">
          <span>Active Employees</span>
          <strong>{active}</strong>
        </div>
        <div className="card stat-card">
          <span>Inactive Employees</span>
          <strong>{inactive}</strong>
        </div>
      </div>

      <div className="chart-grid">
        <div className="card">
          <h2>Employees by Department</h2>
          <HighchartsReact highcharts={Highcharts} options={departmentChart} />
        </div>
        <div className="card">
          <h2>Active vs Inactive</h2>
          <HighchartsReact highcharts={Highcharts} options={statusChart} />
        </div>
      </div>
    </section>
  );
}
