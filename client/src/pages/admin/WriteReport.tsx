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
  FileText,
  Calendar,
  ShieldCheck,
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

type TabType = "tests" | "actions" | "overview" | "review";

const WriteReport = () => {
  const { inspectionId } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<TabType>("tests");

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
      <div className="my-5 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-emerald-100 w-full">
        <div className="flex items-center gap-4 mb-6">
          <button
            type="button"
            onClick={() => navigate("/admin/inspections")}
            className="p-2 rounded-full hover:bg-emerald-50 text-emerald-700 transition-colors cursor-pointer"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl text-emerald-900 font-semibold">
              Write{" "}
              <span className="text-emerald-600 font-bold">
                Inspection Report
              </span>
            </h1>
            <p className="text-xs text-emerald-600/70 mt-0.5">
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
        <div className="flex border-b border-emerald-100 mb-6 gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("tests")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === "tests"
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent text-emerald-600/60 hover:text-emerald-800"
            }`}
          >
            <Activity size={16} />
            1. Tests & Diagnostics
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("actions")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === "actions"
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent text-emerald-600/60 hover:text-emerald-800"
            }`}
          >
            <CheckCircle2 size={16} />
            2. Actions & Schedule
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === "overview"
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent text-emerald-600/60 hover:text-emerald-800"
            }`}
          >
            <Gauge size={16} />
            3. Overview & Compliance
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("review")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === "review"
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent text-emerald-600/60 hover:text-emerald-800"
            }`}
          >
            <FileText size={16} />
            4. Review Report
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* TAB 1: TESTS & DIAGNOSTICS */}
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

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setActiveTab("actions")}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors cursor-pointer"
                >
                  Next: Actions & Schedule
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: ACTIONS & SCHEDULE */}
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

              <div className="bg-white border border-emerald-100 rounded-2xl p-6">
                <label className="block text-sm font-medium text-emerald-900 mb-2">
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
                  className="w-full md:w-1/2 border border-emerald-200 text-emerald-900 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-600 cursor-pointer"
                />
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setActiveTab("tests")}
                  className="px-6 py-2.5 rounded-lg border border-emerald-200 text-emerald-800 text-sm font-medium hover:bg-emerald-50 transition-colors cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("overview")}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors cursor-pointer"
                >
                  Next: Overview & Compliance
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: OVERVIEW & COMPLIANCE */}
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

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setActiveTab("actions")}
                  className="px-6 py-2.5 rounded-lg border border-emerald-200 text-emerald-800 text-sm font-medium hover:bg-emerald-50 transition-colors cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("review")}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors cursor-pointer"
                >
                  Next: Review Report
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: REVIEW REPORT */}
          {activeTab === "review" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 space-y-6 text-emerald-950">
                <div className="flex items-center justify-between border-b border-emerald-200 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-emerald-900">
                      Pre-Submission Review
                    </h3>
                    <p className="text-xs text-emerald-700">
                      Please confirm all details before officially generating
                      the report.
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold">
                    Score: {formData.complianceScore}%
                  </span>
                </div>

                {/* Grid layout of summary info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div className="space-y-3 bg-white p-4 rounded-xl border border-emerald-100 shadow-xs">
                    <h4 className="font-semibold text-emerald-900 flex items-center gap-2 text-xs uppercase tracking-wide">
                      <Activity size={14} className="text-emerald-600" /> Tests
                      & Diagnostics
                    </h4>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between py-1 border-b border-emerald-50">
                        <span className="text-emerald-700">
                          Emissions Test:
                        </span>
                        <span className="font-medium text-emerald-900 capitalize">
                          {formData.emissionsTest
                            ? JSON.stringify(formData.emissionsTest)
                            : "Not specified"}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-emerald-50">
                        <span className="text-emerald-700">Noise Level:</span>
                        <span className="font-medium text-emerald-900 capitalize">
                          {formData.noiseLevel
                            ? JSON.stringify(formData.noiseLevel)
                            : "Not specified"}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-emerald-50">
                        <span className="text-emerald-700">
                          Fuel Efficiency:
                        </span>
                        <span className="font-medium text-emerald-900 capitalize">
                          {formData.fuelEfficiency
                            ? JSON.stringify(formData.fuelEfficiency)
                            : "Not specified"}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-emerald-50">
                        <span className="text-emerald-700">
                          Maintenance Status:
                        </span>
                        <span className="font-medium text-emerald-900 capitalize">
                          {formData.maintenanceStatus
                            ? JSON.stringify(formData.maintenanceStatus)
                            : "Not specified"}
                        </span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-emerald-700">
                          Safety Compliance:
                        </span>
                        <span className="font-medium text-emerald-900 capitalize">
                          {formData.safetyCompliance
                            ? JSON.stringify(formData.safetyCompliance)
                            : "Not specified"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 bg-white p-4 rounded-xl border border-emerald-100 shadow-xs">
                    <h4 className="font-semibold text-emerald-900 flex items-center gap-2 text-xs uppercase tracking-wide">
                      <ShieldCheck size={14} className="text-emerald-600" />{" "}
                      Compliance & Schedule
                    </h4>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between py-1 border-b border-emerald-50">
                        <span className="text-emerald-700">
                          Overall Compliance:
                        </span>
                        <span className="font-medium text-emerald-900 capitalize">
                          {formData.overallCompliance || "Not specified"}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-emerald-50">
                        <span className="text-emerald-700">
                          Compliance Score:
                        </span>
                        <span className="font-medium text-emerald-900">
                          {formData.complianceScore}%
                        </span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-emerald-700 flex items-center gap-1">
                          <Calendar size={12} /> Next Inspection Date:
                        </span>
                        <span className="font-medium text-emerald-900">
                          {formData.nextInspectionDate || "Not scheduled"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommendations and actions review */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-xs space-y-2">
                    <h4 className="font-semibold text-emerald-900 text-xs uppercase tracking-wide">
                      Recommendations ({formData.recommendations.length})
                    </h4>
                    {formData.recommendations.length > 0 ? (
                      <ul className="list-disc pl-4 space-y-1 text-xs text-emerald-800">
                        {formData.recommendations.map((rec, i) => (
                          <li key={i}>{rec}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-emerald-600 italic">
                        No recommendations provided.
                      </p>
                    )}
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-xs space-y-2">
                    <h4 className="font-semibold text-emerald-900 text-xs uppercase tracking-wide">
                      Required Actions ({formData.requiredActions.length})
                    </h4>
                    {formData.requiredActions.length > 0 ? (
                      <ul className="list-disc pl-4 space-y-1 text-xs text-emerald-800">
                        {formData.requiredActions.map((action, i) => (
                          <li key={i}>{action}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-emerald-600 italic">
                        No required actions provided.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setActiveTab("overview")}
                  className="px-6 py-2.5 rounded-lg border border-emerald-200 text-emerald-800 text-sm font-medium hover:bg-emerald-50 transition-colors cursor-pointer"
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
