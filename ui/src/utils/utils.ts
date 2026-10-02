export function formatDate(isoString: string | null | undefined): string {
  if (!isoString) {
    return "";
  }

  const date = new Date(isoString);

  if (isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
}

export const formatDateForInput = (
  dateString: string | null | undefined,
): string => {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const pageSizesOptions = [10, 25, 50];

export const departments = [
  "Engineering",
  "Finance",
  "Human Resources",
  "Marketing",
  "Sales",
];
