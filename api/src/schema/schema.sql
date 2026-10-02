
CREATE DATABASE IF NOT EXISTS employee_db;
USE employee_db;

CREATE TABLE IF NOT EXISTS employees (
    emp_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    salary DECIMAL(10, 2) NOT NULL,
    department VARCHAR(50) NOT NULL,
    joining_date DATE NOT NULL,
    departure_date DATE DEFAULT NULL,
    active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



