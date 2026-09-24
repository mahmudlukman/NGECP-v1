import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  useCreateInspectionReportMutation,
  useGetReportByInspectionIdQuery,
} from "../../redux/features/report/reportApi";
import { initialReportFormData, type ServerError } from "../../@types";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import Loading from "../../components/Loading";
import {
  ArrowLeft,
  ArrowRight,
  ClipboardList,
  ListChecks,
  Activity,
  Gauge,
  CheckCircle2,
} from "lucide-react";
import InspectionSummary from "../../components/InspectionSummary";
import ComplianceOverviewCard from "../../components/Cards/ComplianceOverviewCard";
import EmissionsTestCard from "../../components/Cards/EmmissionsTestCard";
import NoiseLevelCard from "../../components/Cards/NoiseLevelCard";
import FuelEfficiencyCard from "../../components/Cards/FuelEfficiencyCard";
import MaintenanceStatusCard from "../../components/Cards/MaintenanceStatusCard";
import SafetyComplianceCard from "../../components/Cards/SafetyComplianceCard";
import TagListCard from "../../components/Cards/TagListCard";
import FormFooter from "../../components/FormFooter";

type TabType = "overview" | "tests" | "actions";

const WriteReport = () => {
  const { inspectionId } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<TabType>("overview");

  const { data: inspectionData, isLoading: isLoadingInspection } =
    useGetReportByInspectionIdQuery(inspectionId || "");

  const [createReport, { isLoading: isCreating }] =
    useCreateInspectionReportMutation();

  const [formData, setFormData] = useState(initialReportFormData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.complianceScore < 0 || formData.complianceScore > 100) {
      toast.error("Compliance score must be between 0 and 100");
      return;
    }

    try {
      const payload = { inspectionId, ...formData };
      const res = await createReport(payload).unwrap();
      toast.success(res.message || "Report created successfully");
      navigate("/admin/reports");
    } catch (err: unknown) {
      const serverError = err as ServerError;
      toast.error(serverError.data?.message || "Failed to create report");
    }
  };

  if (isLoadingInspection) {
    return (
      <DashboardLayout activeMenu="Inspections">
        <Loading />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="Inspections">
      <div className="my-5 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 w-full">
        <div className="flex items-center gap-4 mb-6">
          <button
            type="button"
            onClick={() => navigate("/admin/inspections")}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl text-slate-700 font-semibold">
              Write{" "}
              <span className="text-primary font-bold">Inspection Report</span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Complete the multi-step inspection record below
            </p>
          </div>
        </div>

        {inspectionData?.inspection && (
          <InspectionSummary
            generatorId={inspectionData.inspection.generator?.generatorId}
            brand={inspectionData.inspection.generator?.brand}
            model={inspectionData.inspection.generator?.model}
          />
        )}

        {/* Wizard Navigation Tabs */}
        <div className="flex border-b border-slate-200 mb-6 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === "overview"
                ? "border-primary text-primary"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <Gauge size={16} />
            1. Overview & Compliance
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("tests")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === "tests"
                ? "border-primary text-primary"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <Activity size={16} />
            2. Tests & Diagnostics
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("actions")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === "actions"
                ? "border-primary text-primary"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <CheckCircle2 size={16} />
            3. Actions & Schedule
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6 animate-fadeIn">
              <ComplianceOverviewCard
                overallCompliance={formData.overallCompliance}
                complianceScore={formData.complianceScore}
                onComplianceChange={(overallCompliance) =>
                  setFormData((prev) => ({ ...prev, overallCompliance }))
                }
                onScoreChange={(complianceScore) =>
                  setFormData((prev) => ({ ...prev, complianceScore }))
                }
              />

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setActiveTab("tests")}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors cursor-pointer"
                >
                  Next: Tests & Diagnostics
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: TESTS & DIAGNOSTICS */}
          {activeTab === "tests" && (
            <div className="space-y-6 animate-fadeIn">
              <EmissionsTestCard
                value={formData.emissionsTest}
                onChange={(emissionsTest) =>
                  setFormData((prev) => ({ ...prev, emissionsTest }))
                }
              />

              <NoiseLevelCard
                value={formData.noiseLevel}
                onChange={(noiseLevel) =>
                  setFormData((prev) => ({ ...prev, noiseLevel }))
                }
              />

              <FuelEfficiencyCard
                value={formData.fuelEfficiency}
                onChange={(fuelEfficiency) =>
                  setFormData((prev) => ({ ...prev, fuelEfficiency }))
                }
              />

              <MaintenanceStatusCard
                value={formData.maintenanceStatus}
                onChange={(maintenanceStatus) =>
                  setFormData((prev) => ({ ...prev, maintenanceStatus }))
                }
              />

              <SafetyComplianceCard
                value={formData.safetyCompliance}
                onChange={(safetyCompliance) =>
                  setFormData((prev) => ({ ...prev, safetyCompliance }))
                }
              />

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setActiveTab("overview")}
                  className="px-6 py-2.5 rounded-lg border border-slate-300 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("actions")}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors cursor-pointer"
                >
                  Next: Actions & Schedule
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: ACTIONS & SCHEDULE */}
          {activeTab === "actions" && (
            <div className="space-y-6 animate-fadeIn">
              <TagListCard
                icon={ClipboardList}
                title="Recommendations"
                label="Recommendations"
                placeholder="Add recommendation..."
                items={formData.recommendations}
                onAdd={(rec) =>
                  setFormData((prev) => ({
                    ...prev,
                    recommendations: [...prev.recommendations, rec],
                  }))
                }
                onRemove={(index) =>
                  setFormData((prev) => ({
                    ...prev,
                    recommendations: prev.recommendations.filter(
                      (_, i) => i !== index,
                    ),
                  }))
                }
                emptyText="No recommendations added"
              />

              <TagListCard
                icon={ListChecks}
                title="Required actions"
                label="Required actions"
                placeholder="Add required action..."
                items={formData.requiredActions}
                onAdd={(action) =>
                  setFormData((prev) => ({
                    ...prev,
                    requiredActions: [...prev.requiredActions, action],
                  }))
                }
                onRemove={(index) =>
                  setFormData((prev) => ({
                    ...prev,
                    requiredActions: prev.requiredActions.filter(
                      (_, i) => i !== index,
                    ),
                  }))
                }
                emptyText="No required actions added"
              />

              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  Next inspection date
                </label>
                <input
                  type="date"
                  value={formData.nextInspectionDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      nextInspectionDate: e.target.value,
                    }))
                  }
                  className="w-full md:w-1/2 border border-slate-300 text-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary cursor-pointer"
                />
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setActiveTab("tests")}
                  className="px-6 py-2.5 rounded-lg border border-slate-300 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Back
                </button>
                <FormFooter
                  onCancel={() => navigate("/admin/inspections")}
                  isSubmitting={isCreating}
                  submitLabel="Create report"
                  submittingLabel="Creating report..."
                />
              </div>
            </div>
          )}
        </form>
      </div>
    </DashboardLayout>
  );
};

export default WriteReport;
