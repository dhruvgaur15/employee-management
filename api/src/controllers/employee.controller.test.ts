import { describe, test, expect, vi, beforeEach } from "vitest";

import pool from "../config/db.js";
import { Request, Response, NextFunction } from "express";
import {
  createEmployee,
  deleteEmployee,
  getAllEmployees,
} from "./employee.controller.js";

// Mock the mysql2 connection pool
vi.mock("../config/db.js", () => ({
  default: {
    query: vi.fn(),
  },
}));

describe("Employee Controller", () => {
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

  describe("createEmployee", () => {
    test("returns 400 if required fields are missing", async () => {
      req.body = { name: "", salary: 0, department: "" };

      await createEmployee(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Missing required employee fields.",
      });
    });

    test("successfully inserts employee and returns 201 with insertId", async () => {
      req.body = {
        name: "John Doe",
        salary: 50000,
        department: "Engineering",
        joining_date: "2026-01-01",
        departure_date: null,
        active: true,
      };

      vi.mocked(pool.query).mockResolvedValueOnce([
        { insertId: 15 },
        [],
      ] as any);

      await createEmployee(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        emp_id: 15,
        ...req.body,
      });
    });
  });

  describe("getAllEmployees", () => {
    test("successfully fetches paginated list of employees with search and filters", async () => {
      req.query = {
        page: "1",
        pageSize: "10",
        search: "John",
        department: "Engineering",
        active: "true",
        sortBy: "name",
        sortOrder: "asc",
      };

      const mockCountRows = [{ total: 1 }];
      const mockEmployees = [
        {
          emp_id: 1,
          name: "John Doe",
          salary: 50000,
          department: "Engineering",
          joining_date: "2026-01-01",
          active: 1,
        },
      ];

      vi.mocked(pool.query)
        .mockResolvedValueOnce([mockCountRows, []] as any)
        .mockResolvedValueOnce([mockEmployees, []] as any);

      await getAllEmployees(
        req as Request,
        res as Response,
        next as NextFunction,
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: [
          {
            emp_id: 1,
            name: "John Doe",
            salary: 50000,
            department: "Engineering",
            joining_date: "2026-01-01",
            active: true, // Formatted boolean
          },
        ],
        pagination: {
          page: 1,
          pageSize: 10,
          totalItems: 1,
          totalPages: 1,
        },
      });
    });
  });

  describe("deleteEmployee", () => {
    test("returns 404 if employee to delete is not found", async () => {
      req.params = { id: "999" };
      vi.mocked(pool.query).mockResolvedValueOnce([
        { affectedRows: 0 },
        [],
      ] as any);

      await deleteEmployee(req as Request<{ id: string }>, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Employee not found." });
    });

    test("successfully deletes employee and returns 200", async () => {
      req.params = { id: "1" };
      vi.mocked(pool.query).mockResolvedValueOnce([
        { affectedRows: 1 },
        [],
      ] as any);

      await deleteEmployee(req as Request<{ id: string }>, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Employee removed successfully.",
      });
    });
  });
});
