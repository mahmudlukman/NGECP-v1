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
      <DashboardLayout activeMenu="Dashboard">
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loading />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="space-y-6 pb-12">
        {/* Header Title & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
              Analytics Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Real-time monitoring for users, generator compliance, inspections,
              and revenue.
            </p>
          </div>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-xs sm:text-sm rounded-xl border border-emerald-200 transition-colors disabled:opacity-60 cursor-pointer"
          >
            <LuRefreshCw
              className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`}
            />
            <span>{isFetching ? "Refreshing..." : "Sync Data"}</span>
          </button>
        </div>

        {/* Error Alert Banner */}
        {isError && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between text-rose-800 text-sm">
            <div className="flex items-center gap-3">
              <LucideAlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
              <span>
                Unable to fetch latest analytics data.{" "}
                {error && "status" in error ? `(Status: ${error.status})` : ""}
              </span>
            </div>
            <button
              type="button"
              onClick={() => refetch()}
              className="text-xs font-bold underline hover:text-rose-900 cursor-pointer"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <InfoCard
            icon={<LuUsers className="w-6 h-6 text-emerald-700" />}
            label="Total Users"
            value={dashboardData?.analytics?.users?.total || 0}
          />
          <InfoCard
            icon={<GiPowerGenerator className="w-6 h-6 text-emerald-700" />}
            label="Total Generators"
            value={dashboardData?.analytics?.generators?.total || 0}
          />
          <InfoCard
            icon={<LuWalletMinimal className="w-6 h-6 text-emerald-700" />}
            label="Total Inspections"
            value={dashboardData?.analytics?.inspections?.total || 0}
          />
          <InfoCard
            icon={<LuHandCoins className="w-6 h-6 text-emerald-700" />}
            label="Total Revenue"
            value={`${currency}${addThousandsSeparator(
              dashboardData?.analytics?.payments?.revenue?.total || 0,
            )}`}
          />
        </div>

        {/* Analytics & Overview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
