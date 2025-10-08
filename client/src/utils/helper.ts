import { format, parse, compareAsc } from "date-fns";

export const currency = "₦";

export const validateEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export function getInitials(name?: string): string {
  if (!name || !name.trim()) return "U";
  return name.trim().charAt(0).toUpperCase();
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
  subtotal: number;
  discount: number;
  tax: number;
  netRevenue: number;
  orderCount: number;
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
      category: "Revenue",
    }));
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
