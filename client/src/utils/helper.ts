import { format, parse, compareAsc } from "date-fns";

export const currency = "₦";

export const validateEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export function getInitials(
  name?: string,
  accountType?: string,
  companyName?: string
): string {
  let source = "";

  if (accountType === "company" && companyName) {
    source = companyName.trim();
  } else if (name) {
    source = name.trim();
  }

  if (!source) return "U";

  const words = source.split(" ");
  if (words.length === 1) return words[0].charAt(0).toUpperCase();
  return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
}

export const addThousandsSeparator = (num: number) => {
  if (num == null || isNaN(num)) return "";

  const [integerPart, fractionalPart] = num.toString().split(".");
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return fractionalPart
    ? `${formattedInteger}.${fractionalPart}`
    : formattedInteger;
};

interface FinancialData {
  month: string; // e.g., "2025-09"
  revenue: number;
}

export const prepareRevenueByMonthChartData = (data: FinancialData[] = []) => {
  if (!Array.isArray(data) || data.length === 0) return [];

  // Validate month format (yyyy-MM)
  const monthRegex = /^\d{4}-\d{2}$/;

  const dataCopy = data.filter(
    (item) =>
      item?.month &&
      monthRegex.test(item.month) &&
      item.revenue !== undefined &&
      !isNaN(item.revenue)
  );

  return dataCopy
    .sort((a, b) => {
      try {
        const dateA = parse(a.month, "yyyy-MM", new Date());
        const dateB = parse(b.month, "yyyy-MM", new Date());
        return compareAsc(dateA, dateB);
      } catch {
        // Fallback: sort by month string if parsing fails
        return a.month.localeCompare(b.month);
      }
    })
    .map((item) => {
      try {
        const parsedDate = parse(item.month, "yyyy-MM", new Date());
        if (isNaN(parsedDate.getTime())) {
          throw new Error("Invalid date");
        }
        return {
          month: format(parsedDate, "MMM yyyy"),
          amount: item.revenue,
        };
      } catch {
        // Fallback for invalid month
        return {
          month: item.month || "Unknown",
          amount: item.revenue,
        };
      }
    });
};

interface InspectionsData {
  month: string; // e.g., "2025-09"
  count: number;
}

export const prepareInspectionsByMonthChartData = (
  data: InspectionsData[] = []
) => {
  if (!Array.isArray(data) || data.length === 0) return [];

  const dataCopy = data.filter(
    (item) => item?.month && item?.count !== undefined
  );

  return dataCopy
    .sort((a, b) => {
      const dateA = parse(`${a.month}-01`, "yyyy-MM-dd", new Date());
      const dateB = parse(`${b.month}-01`, "yyyy-MM-dd", new Date());
      return compareAsc(dateA, dateB);
    })
    .map((item) => {
      try {
        const parsedDate = parse(`${item.month}-01`, "yyyy-MM-dd", new Date());
        const formattedMonth = format(parsedDate, "MMM yyyy");
        return {
          month: formattedMonth,
          amount: item.count,
        };
      } catch {
        return {
          month: item.month ?? "Unknown",
          amount: item.count,
        };
      }
    });
};

export interface UserGrowthData {
  date: string;
  count: number;
}

export const prepareUsersByMonthChartData = (
  data: { month: string; count: number }[] = []
) => {
  return data
    .sort((a, b) =>
      compareAsc(
        parse(a.month, "yyyy-MM", new Date()),
        parse(b.month, "yyyy-MM", new Date())
      )
    )
    .map((item) => ({
      month: format(parse(item.month, "yyyy-MM", new Date()), "MMM yyyy"),
      count: item.count,
    }));
};