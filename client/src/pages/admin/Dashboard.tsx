import { LuHandCoins, LuUsers, LuWalletMinimal } from "react-icons/lu";
import { GiPowerGenerator } from "react-icons/gi";
import { addThousandsSeparator, currency } from "../../utils/helper";
import InfoCard from "../../components/Cards/InfoCard";
import Loading from "../../components/Loading";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import { useDashboardAnalyticsQuery } from "../../redux/features/Analytics/analyticsApi";
import InspectionOverview from "../../components/Dashboard/InspectionsOverview";
import GeneratorsOverview from "../../components/Dashboard/GeneratorsOverview";
import UsersByMonthChart from "../../components/Dashboard/UsersByMonthChart";
import GeneratorByMonthChart from "../../components/Dashboard/GeneratorByMonthChart";
import { parse, format } from "date-fns";
import InspectionsByMonthChart from "../../components/Dashboard/InspectionsByMonthChart";
import RevenueByMonthChart from "../../components/Dashboard/RevenueByMonthChart";

const Dashboard = () => {
  const {
    data: dashboardData,
    isLoading: loading,
    isError,
    error,
    refetch,
  } = useDashboardAnalyticsQuery({});

  console.log(dashboardData);

  type UsersByMonthItem = {
    month: string | Date;
    count: number;
  };

  const usersByMonth =
    dashboardData?.analytics?.users?.usersByMonth?.map(
      (item: UsersByMonthItem) => ({
        month:
          typeof item.month === "string"
            ? format(parse(item.month, "yyyy-MM", new Date()), "MMM yyyy")
            : format(item.month as Date, "MMM yyyy"),
        count: item.count,
      })
    ) || [];

  type GeneratorsByMonthItem = {
    month: string | Date;
    count: number;
  };

  const GeneratorsByMonth =
    dashboardData?.analytics?.generators?.generatorsByMonth?.map(
      (item: GeneratorsByMonthItem) => ({
        month:
          typeof item.month === "string"
            ? format(parse(item.month, "yyyy-MM", new Date()), "MMM yyyy")
            : format(item.month as Date, "MMM yyyy"),
        count: item.count,
      })
    ) || [];

  // InspectionsByMonthItem
  type InspectionsByMonthItem = {
    month: string | Date;
    count: number;
  };

  const InspectionsByMonth =
    dashboardData?.analytics?.inspections?.inspectionsByMonth?.map(
      (item: InspectionsByMonthItem) => ({
        month:
          typeof item.month === "string"
            ? format(parse(item.month, "yyyy-MM", new Date()), "MMM yyyy")
            : format(item.month as Date, "MMM yyyy"),
        count: item.count,
      })
    ) || [];

  // Handle error state
  if (isError) {
    console.log("Something went wrong. Please try again.", error);
  }

  if (loading) {
    return (
      <DashboardLayout activeMenu="Dashboard">
        <Loading />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <InfoCard
            icon={<LuUsers />}
            label="Total Users"
            value={dashboardData?.analytics?.users?.total || 0}
            color="bg-primary"
          />
          <InfoCard
            icon={<GiPowerGenerator />}
            label="Total Generators"
            value={dashboardData?.analytics?.generators?.total || 0}
            color="bg-orange-500"
          />
          <InfoCard
            icon={<LuWalletMinimal />}
            label="Total Inspections"
            value={dashboardData?.analytics?.inspections?.total || 0}
            color="bg-cyan-500"
          />
          <InfoCard
            icon={<LuHandCoins />}
            label="Total Revenue"
            value={`${currency}${addThousandsSeparator(
              dashboardData?.analytics?.payments?.revenue?.total || 0
            )}`}
            color="bg-red-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
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
          <GeneratorByMonthChart data={GeneratorsByMonth} />
          <InspectionsByMonthChart data={InspectionsByMonth} />
          <InspectionOverview
            totalInspections={dashboardData?.analytics?.inspections?.total || 0}
            Pending={dashboardData?.analytics?.inspections?.pending || 0}
            Cancelled={dashboardData?.analytics?.inspections?.Cancelled || 0}
            Scheduled={dashboardData?.analytics?.inspections?.Scheduled || 0}
            Completed={dashboardData?.analytics?.inspections?.Completed || 0}
          />
          <UsersByMonthChart data={usersByMonth} />
          <RevenueByMonthChart
            data={dashboardData?.analytics?.payments?.revenueByMonth || []}/>
        </div>

        {/* Optional: Add refresh button */}
        {isError && (
          <div className="mt-6 text-center">
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              Retry Loading Data
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
