import React, { useMemo } from "react";
import {
  LuHandCoins,
  LuUsers,
  LuWalletMinimal,
  LuRefreshCw,
} from "react-icons/lu";
import { GiPowerGenerator } from "react-icons/gi";
import { parse, format } from "date-fns";

import { addThousandsSeparator, currency } from "../../utils/helper";
import InfoCard from "../../components/Cards/InfoCard";
import Loading from "../../components/Loading";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import { useDashboardAnalyticsQuery } from "../../redux/features/Analytics/analyticsApi";

import InspectionOverview from "../../components/Dashboard/InspectionsOverview";
import GeneratorsOverview from "../../components/Dashboard/GeneratorsOverview";
import UsersByMonthChart from "../../components/Dashboard/UsersByMonthChart";
import GeneratorByMonthChart from "../../components/Dashboard/GeneratorByMonthChart";
import InspectionsByMonthChart from "../../components/Dashboard/InspectionsByMonthChart";
import RevenueByMonthChart from "../../components/Dashboard/RevenueByMonthChart";
import { LucideAlertTriangle } from "lucide-react";

type MonthlyCountItem = {
  month: string | Date;
  count: number;
};

const Dashboard: React.FC = () => {
  const {
    data: dashboardData,
    isLoading: loading,
    isError,
    error,
    refetch,
    isFetching,
  } = useDashboardAnalyticsQuery({});

  // Helper to format date strings consistently
  const formatMonth = (item: MonthlyCountItem) => {
    try {
      return typeof item.month === "string"
        ? format(parse(item.month, "yyyy-MM", new Date()), "MMM yyyy")
        : format(item.month as Date, "MMM yyyy");
    } catch {
      return String(item.month);
    }
  };

  // Memoized Monthly Transformations
  const usersByMonth = useMemo(() => {
    const list = dashboardData?.analytics?.users?.usersByMonth || [];
    return list.map((item: MonthlyCountItem) => ({
      month: formatMonth(item),
      count: item.count,
    }));
  }, [dashboardData?.analytics?.users?.usersByMonth]);

  const generatorsByMonth = useMemo(() => {
    const list = dashboardData?.analytics?.generators?.generatorsByMonth || [];
    return list.map((item: MonthlyCountItem) => ({
      month: formatMonth(item),
      count: item.count,
    }));
  }, [dashboardData?.analytics?.generators?.generatorsByMonth]);

  const inspectionsByMonth = useMemo(() => {
    const list =
      dashboardData?.analytics?.inspections?.inspectionsByMonth || [];
    return list.map((item: MonthlyCountItem) => ({
      month: formatMonth(item),
      count: item.count,
    }));
  }, [dashboardData?.analytics?.inspections?.inspectionsByMonth]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loading fullScreen={false} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-12 font-[Figtree,ui-sans-serif,system-ui,sans-serif]">
        {/* Header Title & Actions */}
        <div className="flex flex-col gap-4 rounded-2xl border border-[#0B1F1A]/10 bg-white p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-[Newsreader,Georgia,serif] text-2xl font-normal tracking-tight text-[#0B1F1A]">
              Analytics Dashboard
            </h1>
            <p className="mt-1 text-xs text-[#0B1F1A]/55 sm:text-sm">
              Real-time monitoring for users, generator compliance, inspections,
              and revenue.
            </p>
          </div>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#16785A]/20 bg-[#16785A]/[0.08] px-4 py-2 text-xs font-semibold text-[#16785A] transition-colors hover:bg-[#16785A]/[0.14] disabled:opacity-60 sm:text-sm"
          >
            <LuRefreshCw
              className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
            <span>{isFetching ? "Refreshing..." : "Sync Data"}</span>
          </button>
        </div>

        {/* Error Alert Banner */}
        {isError && (
          <div className="flex items-center justify-between rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
            <div className="flex items-center gap-3">
              <LucideAlertTriangle className="h-5 w-5 flex-shrink-0 text-rose-600" />
              <span>
                Unable to fetch latest analytics data.{" "}
                {error && "status" in error ? `(Status: ${error.status})` : ""}
              </span>
            </div>
            <button
              type="button"
              onClick={() => refetch()}
              className="cursor-pointer text-xs font-bold underline hover:text-rose-900"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <InfoCard
            icon={<LuUsers className="h-6 w-6 text-[#16785A]" />}
            label="Total Users"
            value={dashboardData?.analytics?.users?.total || 0}
          />
          <InfoCard
            icon={<GiPowerGenerator className="h-6 w-6 text-[#16785A]" />}
            label="Total Generators"
            value={dashboardData?.analytics?.generators?.total || 0}
          />
          <InfoCard
            icon={<LuWalletMinimal className="h-6 w-6 text-[#16785A]" />}
            label="Total Inspections"
            value={dashboardData?.analytics?.inspections?.total || 0}
          />
          <InfoCard
            icon={<LuHandCoins className="h-6 w-6 text-[#16785A]" />}
            label="Total Revenue"
            value={`${currency}${addThousandsSeparator(
              dashboardData?.analytics?.payments?.revenue?.total || 0,
            )}`}
          />
        </div>

        {/* Analytics & Overview Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <GeneratorsOverview
            totalGenerators={dashboardData?.analytics?.generators?.total || 0}
            active={dashboardData?.analytics?.generators?.active || 0}
            inactive={dashboardData?.analytics?.generators?.inactive || 0}
            underInspection={
              dashboardData?.analytics?.generators?.underInspection || 0
            }
            compliant={dashboardData?.analytics?.generators?.compliant || 0}
            nonCompliant={
              dashboardData?.analytics?.generators?.nonCompliant || 0
            }
          />
          <GeneratorByMonthChart data={generatorsByMonth} />
          <InspectionsByMonthChart data={inspectionsByMonth} />
          <InspectionOverview
            totalInspections={dashboardData?.analytics?.inspections?.total || 0}
            Pending={dashboardData?.analytics?.inspections?.pending || 0}
            Cancelled={dashboardData?.analytics?.inspections?.cancelled || 0}
            Scheduled={dashboardData?.analytics?.inspections?.scheduled || 0}
            Completed={dashboardData?.analytics?.inspections?.completed || 0}
          />
          <UsersByMonthChart data={usersByMonth} />
          <RevenueByMonthChart
            data={dashboardData?.analytics?.payments?.revenueByMonth || []}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
