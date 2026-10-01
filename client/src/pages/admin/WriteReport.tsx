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

const tabButtonClass = (isActive: boolean) =>
  `flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors cursor-pointer ${
    isActive
      ? "border-[#16785A] text-[#0B1F1A]"
      : "border-transparent text-[#0B1F1A]/50 hover:text-[#0B1F1A]/80"
  }`;

const secondaryButtonClass =
  "px-6 py-2.5 rounded-lg border border-[#0B1F1A]/15 text-[#0B1F1A]/75 text-sm font-medium hover:bg-[#0B1F1A]/[0.04] transition-colors cursor-pointer";

const primaryButtonClass =
  "flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#0B1F1A] text-[#F3F1EA] text-sm font-medium hover:bg-[#12332b] transition-colors cursor-pointer";

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
      <DashboardLayout>
        <Loading fullScreen={false} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="my-5 w-full rounded-2xl border border-[#0B1F1A]/10 bg-white p-6 font-[Figtree,ui-sans-serif,system-ui,sans-serif] shadow-[0_20px_40px_-30px_rgba(11,31,26,0.25)] md:p-8">
        <div className="mb-6 flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate("/admin/inspections")}
            className="cursor-pointer rounded-full p-2 text-[#0B1F1A]/55 transition-colors hover:bg-[#0B1F1A]/[0.06]"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-[Newsreader,Georgia,serif] text-2xl font-normal text-[#0B1F1A]/70">
              Write{" "}
              <span className="font-medium text-[#0B1F1A]">
                Inspection Report
              </span>
            </h1>
            <p className="mt-0.5 text-xs text-[#0B1F1A]/50">
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
        <div className="mb-6 flex gap-2 overflow-x-auto border-b border-[#0B1F1A]/10">
          <button
            type="button"
            onClick={() => setActiveTab("tests")}
            className={tabButtonClass(activeTab === "tests")}
          >
            <Activity size={16} />
            1. Tests & Diagnostics
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("actions")}
            className={tabButtonClass(activeTab === "actions")}
          >
            <CheckCircle2 size={16} />
            2. Actions & Schedule
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={tabButtonClass(activeTab === "overview")}
          >
            <Gauge size={16} />
            3. Overview & Compliance
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("review")}
            className={tabButtonClass(activeTab === "review")}
          >
            <FileText size={16} />
            4. Review Report
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* TAB 1: TESTS & DIAGNOSTICS */}
          {activeTab === "tests" && (
            <div className="animate-fadeIn space-y-6">
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
                  className={primaryButtonClass}
                >
                  Next: Actions & Schedule
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: ACTIONS & SCHEDULE */}
          {activeTab === "actions" && (
            <div className="animate-fadeIn space-y-6">
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

              <div className="rounded-2xl border border-[#0B1F1A]/10 bg-white p-6">
                <label className="mb-2 block text-sm font-medium text-[#0B1F1A]/70">
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
                  className="w-full cursor-pointer rounded-lg border border-[#0B1F1A]/15 px-3 py-2 text-sm text-[#0B1F1A] outline-none focus:border-[#16785A] focus:ring-2 focus:ring-[#16785A]/20 md:w-1/2"
                />
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setActiveTab("tests")}
                  className={secondaryButtonClass}
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("overview")}
                  className={primaryButtonClass}
                >
                  Next: Overview & Compliance
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: OVERVIEW & COMPLIANCE */}
          {activeTab === "overview" && (
            <div className="animate-fadeIn space-y-6">
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
                  className={secondaryButtonClass}
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("review")}
                  className={primaryButtonClass}
                >
                  Next: Review Report
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: REVIEW REPORT */}
          {activeTab === "review" && (
            <div className="animate-fadeIn space-y-6">
              <div className="space-y-6 rounded-2xl border border-[#0B1F1A]/10 bg-[#F7F6F1] p-6 text-[#0B1F1A]">
                <div className="flex items-center justify-between border-b border-[#0B1F1A]/10 pb-4">
                  <div>
                    <h3 className="font-[Newsreader,Georgia,serif] text-lg font-normal text-[#0B1F1A]">
                      Pre-Submission Review
                    </h3>
                    <p className="text-xs text-[#0B1F1A]/55">
                      Please confirm all details before officially generating
                      the report.
                    </p>
                  </div>
                  <span className="rounded-full bg-[#16785A]/10 px-3 py-1 text-xs font-semibold text-[#16785A]">
                    Score: {formData.complianceScore}%
                  </span>
                </div>

                {/* Grid layout of summary info */}
                <div className="grid grid-cols-1 gap-6 text-sm md:grid-cols-2">
                  <div className="space-y-3 rounded-xl border border-[#0B1F1A]/10 bg-white p-4 shadow-xs">
                    <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#0B1F1A]">
                      <Activity size={14} className="text-[#16785A]" /> Tests &
                      Diagnostics
                    </h4>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between border-b border-[#0B1F1A]/5 py-1">
                        <span className="text-[#0B1F1A]/55">
                          Emissions Test:
                        </span>
                        <span className="font-medium capitalize text-[#0B1F1A]">
                          {formData.emissionsTest
                            ? JSON.stringify(formData.emissionsTest)
                            : "Not specified"}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-[#0B1F1A]/5 py-1">
                        <span className="text-[#0B1F1A]/55">Noise Level:</span>
                        <span className="font-medium capitalize text-[#0B1F1A]">
                          {formData.noiseLevel
                            ? JSON.stringify(formData.noiseLevel)
                            : "Not specified"}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-[#0B1F1A]/5 py-1">
                        <span className="text-[#0B1F1A]/55">
                          Fuel Efficiency:
                        </span>
                        <span className="font-medium capitalize text-[#0B1F1A]">
                          {formData.fuelEfficiency
                            ? JSON.stringify(formData.fuelEfficiency)
                            : "Not specified"}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-[#0B1F1A]/5 py-1">
                        <span className="text-[#0B1F1A]/55">
                          Maintenance Status:
                        </span>
                        <span className="font-medium capitalize text-[#0B1F1A]">
                          {formData.maintenanceStatus
                            ? JSON.stringify(formData.maintenanceStatus)
                            : "Not specified"}
                        </span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-[#0B1F1A]/55">
                          Safety Compliance:
                        </span>
                        <span className="font-medium capitalize text-[#0B1F1A]">
                          {formData.safetyCompliance
                            ? JSON.stringify(formData.safetyCompliance)
                            : "Not specified"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 rounded-xl border border-[#0B1F1A]/10 bg-white p-4 shadow-xs">
                    <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#0B1F1A]">
                      <ShieldCheck size={14} className="text-[#16785A]" />{" "}
                      Compliance & Schedule
                    </h4>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between border-b border-[#0B1F1A]/5 py-1">
                        <span className="text-[#0B1F1A]/55">
                          Overall Compliance:
                        </span>
                        <span className="font-medium capitalize text-[#0B1F1A]">
                          {formData.overallCompliance || "Not specified"}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-[#0B1F1A]/5 py-1">
                        <span className="text-[#0B1F1A]/55">
                          Compliance Score:
                        </span>
                        <span className="font-medium text-[#0B1F1A]">
                          {formData.complianceScore}%
                        </span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="flex items-center gap-1 text-[#0B1F1A]/55">
                          <Calendar size={12} /> Next Inspection Date:
                        </span>
                        <span className="font-medium text-[#0B1F1A]">
                          {formData.nextInspectionDate || "Not scheduled"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommendations and actions review */}
                <div className="grid grid-cols-1 gap-6 text-sm md:grid-cols-2">
                  <div className="space-y-2 rounded-xl border border-[#0B1F1A]/10 bg-white p-4 shadow-xs">
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-[#0B1F1A]">
                      Recommendations ({formData.recommendations.length})
                    </h4>
                    {formData.recommendations.length > 0 ? (
                      <ul className="list-disc space-y-1 pl-4 text-xs text-[#0B1F1A]/75">
                        {formData.recommendations.map((rec, i) => (
                          <li key={i}>{rec}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs italic text-[#0B1F1A]/40">
                        No recommendations provided.
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 rounded-xl border border-[#0B1F1A]/10 bg-white p-4 shadow-xs">
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-[#0B1F1A]">
                      Required Actions ({formData.requiredActions.length})
                    </h4>
                    {formData.requiredActions.length > 0 ? (
                      <ul className="list-disc space-y-1 pl-4 text-xs text-[#0B1F1A]/75">
                        {formData.requiredActions.map((action, i) => (
                          <li key={i}>{action}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs italic text-[#0B1F1A]/40">
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
                  className={secondaryButtonClass}
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
