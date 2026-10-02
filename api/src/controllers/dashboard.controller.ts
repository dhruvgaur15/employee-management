import { Request, Response, NextFunction } from "express";
import pool from "../config/db.js";
import { RowDataPacket } from "mysql2";
import {
  DepartmentChartData,
  StatusChartData,
  DashboardStats,
} from "../types/dashboard.js";

export const getDashboardStats = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const [deptResults, statusResults] = await Promise.all([
      pool.query<RowDataPacket[]>(
        "SELECT department, COUNT(*) as count FROM employees GROUP BY department",
      ),
      pool.query<RowDataPacket[]>(
        "SELECT active, COUNT(*) as count FROM employees GROUP BY active",
      ),
    ]);

    const byDepartment: DepartmentChartData[] = deptResults[0].map((row) => ({
      department: row.department,
      count: Number(row.count),
    }));

    let total = 0;
    const byStatus: StatusChartData[] = statusResults[0].map((row) => {
      const count = Number(row.count);
      total += count;
      return {
        name: row.active === 1 ? "Active" : "Inactive",
        y: count,
      };
    });

    const statsResponse: DashboardStats = {
      total,
      byStatus,
      byDepartment,
    };

    res.status(200).json(statsResponse);
  } catch (err) {
    next(err);
  }
};
