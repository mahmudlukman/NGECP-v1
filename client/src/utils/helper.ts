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

  // Return first two initials if possible
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

// New financial data structure from backend
interface FinancialData {
  month: string; // e.g. "2025-09"
  revenue: number;
}

export const prepareRevenueByMonthChartData = (data: FinancialData[] = []) => {
  if (!Array.isArray(data) || data.length === 0) return [];

  const dataCopy = [...data];

  return dataCopy
    .sort((a, b) =>
      compareAsc(
        parse(a.month, "yyyy-MM", new Date()),
        parse(b.month, "yyyy-MM", new Date())
      )
    )
    .map((item) => ({
      month: format(parse(item.month, "yyyy-MM", new Date()), "MMM yyyy"),
      amount: item.revenue,
    }));
};

// New financial data structure from backend
interface inspectionsData {
  month: string; // e.g. "2025-09"
  count: number;
}

export const prepareInspectionsByMonthChartData = (
  data: inspectionsData[] = []
) => {
  if (!Array.isArray(data) || data.length === 0) return [];

  const dataCopy = data.filter((item) => item?.month && item?.count !== undefined);

  return dataCopy
    .sort((a, b) => {
      const dateA = parse(`${a.month}-01`, "yyyy-MM-dd", new Date());
      const dateB = parse(`${b.month}-01`, "yyyy-MM-dd", new Date());
      return compareAsc(dateA, dateB);
    })
    .map((item) => {
      try {
        // Append "-01" so "2025-10" becomes a valid full date string
        const parsedDate = parse(`${item.month}-01`, "yyyy-MM-dd", new Date());
        const formattedMonth = format(parsedDate, "MMM yyyy"); // -> "Oct 2025"

        return {
          month: formattedMonth,
          amount: item.count,
        };
      } catch {
        // fallback
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
