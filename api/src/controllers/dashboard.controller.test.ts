import { describe, test, expect, vi, beforeEach } from "vitest";
import pool from "../config/db.js";
import { Request, Response, NextFunction } from "express";
import { getDashboardStats } from "./dashboard.controller.js";

// Mock the mysql2 connection pool
vi.mock("../config/db.js", () => ({
  default: {
    query: vi.fn(),
  },
}));

describe("getDashboardStats Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    vi.clearAllMocks();
    req = {};
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    next = vi.fn();
  });

  test("successfully returns aggregated department and status dashboard stats", async () => {
    // Mock database response for pool.query Promise.all calls
    const mockDeptRows = [
      { department: "Engineering", count: 5 },
      { department: "Finance", count: 3 },
    ];
    const mockStatusRows = [
      { active: 1, count: 6 },
      { active: 0, count: 2 },
    ];

    vi.mocked(pool.query)
      .mockResolvedValueOnce([mockDeptRows, []] as any)
      .mockResolvedValueOnce([mockStatusRows, []] as any);

    await getDashboardStats(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      total: 8,
      byStatus: [
        { name: "Active", y: 6 },
        { name: "Inactive", y: 2 },
      ],
      byDepartment: [
        { department: "Engineering", count: 5 },
        { department: "Finance", count: 3 },
      ],
    });
    expect(next).not.toHaveBeenCalled();
  });

  test("handles database error and calls next middleware", async () => {
    const dbError = new Error("Database connection failed");
    vi.mocked(pool.query).mockRejectedValueOnce(dbError);

    await getDashboardStats(req as Request, res as Response, next);

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(dbError);
  });
});
