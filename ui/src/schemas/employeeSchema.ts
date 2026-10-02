import z from "zod";

export const schema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters"),
    salary: z.coerce
      .number<number>()
      .positive("Salary must be greater than 0")
      .max(1000000, "Salary must not be greater than 1000000"),
    department: z.string().trim().min(1, "Department is required"),
    joining_date: z.string().min(1, "Joining date is required"),
    departure_date: z.string(),
    active: z.boolean(),
  })
  .refine(
    (data) => !data.departure_date || data.departure_date >= data.joining_date,
    {
      message: "Departure date cannot be before joining date",
      path: ["departure_date"],
    },
  );

export type FormValues = z.infer<typeof schema>;
