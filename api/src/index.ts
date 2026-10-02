import express from "express";
import "dotenv/config";
import employeeRoutes from "./routes/employee.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use(express.json());

app.use("/api/employees", employeeRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.listen(PORT, () => {
  console.log(`listening at http://localhost:${PORT}`);
});
