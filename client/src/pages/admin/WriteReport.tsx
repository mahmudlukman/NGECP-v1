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
import { ArrowLeft, ClipboardList, ListChecks } from "lucide-react";
import InspectionSummary from "../../components/InspectionSummary";
import ComplianceOverviewCard from "../../components/Cards/ComplianceOverviewCard";
import EmissionsTestCard from "../../components/Cards/EmmissionsTestCard";
import NoiseLevelCard from "../../components/Cards/NoiseLevelCard";
import FuelEfficiencyCard from "../../components/Cards/FuelEfficiencyCard";
import MaintenanceStatusCard from "../../components/Cards/MaintenanceStatusCard";
import SafetyComplianceCard from "../../components/Cards/SafetyComplianceCard";
import TagListCard from "../../components/Cards/TagListCard";
import FormFooter from "../../components/FormFooter";

const WriteReport = () => {
  const { inspectionId } = useParams();
  const navigate = useNavigate();

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
      <div className="my-5 bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50 w-full">
        <div className="no-scrollbar flex-1 h-[90vh] overflow-y-scroll flex flex-col justify-between pr-2">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <button
                type="button"
                onClick={() => navigate("/admin/inspections")}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors cursor-pointer"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-2xl text-slate-600 font-semibold">
                Write{" "}
                <span className="text-slate-800 font-bold">
                  Inspection Report
                </span>
              </h1>
            </div>

            {inspectionData?.inspection && (
              <InspectionSummary
                generatorId={inspectionData.inspection.generator?.generatorId}
                brand={inspectionData.inspection.generator?.brand}
                model={inspectionData.inspection.generator?.model}
              />
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
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

              <FormFooter
                onCancel={() => navigate("/admin/inspections")}
                isSubmitting={isCreating}
                submitLabel="Create report"
                submittingLabel="Creating report..."
              />
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default WriteReport;
