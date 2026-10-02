import { NextFunction, Request, Response } from "express";
import pool from "../config/db.js";
import { Employee, EmployeeQuery } from "../types/employee.js";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export const createEmployee = async (
  req: Request<{}, {}, Employee>,
  res: Response,
): Promise<Response> => {
  const { name, salary, department, joining_date, departure_date, active } =
    req.body;
  if (!name || !salary || !department) {
    return res
      .status(400)
      .json({ message: "Missing required employee fields." });
  }
  try {
    const query = `INSERT INTO employees (name, salary, department, joining_date, departure_date, active) VALUES (?, ?, ?, ?, ?, ?)`;
    const values = [
      name,
      salary,
      department,
      joining_date,
      departure_date || null,
      active !== undefined ? active : true,
    ];
    const [result] = await pool.query<ResultSetHeader>(query, values);
    return res.status(201).json({ emp_id: result.insertId, ...req.body });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return res.status(500).json({ error: message });
  }
};

export const getAllEmployees = async (
  req: Request<{}, {}, {}, EmployeeQuery>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const page = parseInt(req.query.page || "1", 10);
    const pageSize = parseInt(req.query.pageSize || "10", 10);
    const offset = (page - 1) * pageSize;

    const allowedSortColumns = [
      "emp_id",
      "name",
      "salary",
      "department",
      "joining_date",
      "active",
    ];
    const sortBy = allowedSortColumns.includes(req.query.sortBy || "")
      ? req.query.sortBy
      : "emp_id";
    const sortOrder =
      req.query.sortOrder?.toLowerCase() === "asc" ? "ASC" : "DESC";

    const whereConditions: string[] = [];
    const queryParams: (string | number)[] = [];

    const searchQuery = req.query.search?.trim() || "";
    if (searchQuery) {
      const isNumericId = !isNaN(Number(searchQuery));
      if (isNumericId) {
        whereConditions.push("(emp_id = ? OR name LIKE ?)");
        queryParams.push(Number(searchQuery), `%${searchQuery}%`);
      } else {
        whereConditions.push("name LIKE ?");
        queryParams.push(`%${searchQuery}%`);
      }
    }

    const departmentFilter = req.query.department?.trim() || "";
    if (departmentFilter) {
      whereConditions.push("department = ?");
      queryParams.push(departmentFilter);
    }

    const activeFilter = req.query.active?.trim().toLowerCase();
    if (activeFilter === "true" || activeFilter === "false") {
      whereConditions.push("active = ?");
      queryParams.push(activeFilter === "true" ? 1 : 0);
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

    const countQuery = `SELECT COUNT(*) as total FROM employees ${whereClause}`;
    const [countRows] = await pool.query<RowDataPacket[]>(
      countQuery,
      queryParams,
    );
    const totalItems = countRows?.[0]?.total ?? 0;
    const totalPages = Math.ceil(totalItems / pageSize);

    const dataQuery = `
      SELECT * FROM employees 
      ${whereClause}
      ORDER BY ${sortBy} ${sortOrder} 
      LIMIT ? OFFSET ?
    `;

    const dataParams = [...queryParams, pageSize, offset];
    const [rows] = await pool.query<RowDataPacket[] & Employee[]>(
      dataQuery,
      dataParams,
    );

    const formattedRows = rows.map((row) => ({
      ...row,
      active: row.active === 1 || (row.active as unknown as boolean) === true,
    }));

    res.status(200).json({
      data: formattedRows,
      pagination: {
        page,
        pageSize,
        totalItems,
        totalPages,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getEmployeeById = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<Response> => {
  try {
    const [rows] = await pool.query<RowDataPacket[] & Employee[]>(
      "SELECT * FROM employees WHERE emp_id = ?",
      [req.params.id],
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Employee not found." });
    }

    const employee = {
      ...rows[0],
      active:
        rows[0].active === 1 || (rows[0].active as unknown as boolean) === true,
    };

    return res.status(200).json(employee);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return res.status(500).json({ error: message });
  }
};

export const updateEmployee = async (
  req: Request<{ id: string }, {}, Employee>,
  res: Response,
): Promise<Response> => {
  const { name, salary, department, joining_date, departure_date, active } =
    req.body;
  try {
    const query = `UPDATE employees SET name=?, salary=?, department=?, joining_date=?, departure_date=?, active=? WHERE emp_id=?`;
    const [result] = await pool.query<ResultSetHeader>(query, [
      name,
      salary,
      department,
      joining_date,
      departure_date,
      active,
      req.params.id,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Employee not found." });
    }
    return res.status(200).json({ message: "Employee updated successfully." });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return res.status(500).json({ error: message });
  }
};

export const deleteEmployee = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<Response> => {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM employees WHERE emp_id = ?",
      [req.params.id],
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Employee not found." });
    return res.status(200).json({ message: "Employee removed successfully." });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return res.status(500).json({ error: message });
  }
};
