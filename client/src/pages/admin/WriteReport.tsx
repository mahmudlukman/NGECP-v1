import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  useCreateInspectionReportMutation,
  useGetReportByInspectionIdQuery,
} from "../../redux/features/report/reportApi";
import type { ServerError } from "../../@types";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import Loading from "../../components/Loading";
import { ArrowLeft, Save } from "lucide-react";

const WriteReport = () => {
  const { inspectionId } = useParams();
  const navigate = useNavigate();

  const { data: inspectionData, isLoading: isLoadingInspection } =
    useGetReportByInspectionIdQuery(inspectionId || "");

  const [createReport, { isLoading: isCreating }] =
    useCreateInspectionReportMutation();

  const [formData, setFormData] = useState({
    overallCompliance: true,
    complianceScore: 0,
    emissionsTest: {
      passed: true,
      co2Level: 0,
      noxLevel: 0,
      particulateLevel: 0,
      notes: "",
    },
    noiseLevel: {
      passed: true,
      decibelReading: 0,
      notes: "",
    },
    fuelEfficiency: {
      passed: true,
      rating: "",
      notes: "",
    },
    maintenanceStatus: {
      passed: true,
      issues: [] as string[],
      notes: "",
    },
    safetyCompliance: {
      passed: true,
      issues: [] as string[],
      notes: "",
    },
    recommendations: [] as string[],
    requiredActions: [] as string[],
    nextInspectionDate: "",
  });

  const [newRecommendation, setNewRecommendation] = useState("");
  const [newRequiredAction, setNewRequiredAction] = useState("");
  const [newMaintenanceIssue, setNewMaintenanceIssue] = useState("");
  const [newSafetyIssue, setNewSafetyIssue] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.complianceScore < 0 || formData.complianceScore > 100) {
      toast.error("Compliance score must be between 0 and 100");
      return;
    }

    try {
      const payload = {
        inspectionId,
        ...formData,
      };

      const res = await createReport(payload).unwrap();
      toast.success(res.message || "Report created successfully");
      navigate("/admin/reports");
    } catch (err: unknown) {
      const serverError = err as ServerError;
      toast.error(serverError.data?.message || "Failed to create report");
    }
  };

  const addItem = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<string>>,
    array: string[],
    field: string
  ) => {
    if (!value.trim()) return;

    // Fix: Handle nested objects properly
    if (field === "maintenanceStatus" || field === "safetyCompliance") {
      setFormData((prev) => ({
        ...prev,
        [field]: {
          ...prev[field],
          issues: [...prev[field].issues, value.trim()],
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: [...array, value.trim()],
      }));
    }
    setter("");
  };

  const removeItem = (index: number, array: string[], field: string) => {
    if (field === "maintenanceStatus" || field === "safetyCompliance") {
      setFormData((prev) => ({
        ...prev,
        [field]: {
          ...prev[field],
          issues: prev[field].issues.filter((_, i) => i !== index),
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: array.filter((_, i) => i !== index),
      }));
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
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/admin/inspections")}
            className="p-2 rounded-full hover:bg-gray-200 text-gray-600 transition"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl text-slate-600 font-semibold">
            Write{" "}
            <span className="text-slate-800 font-bold">Inspection Report</span>
          </h1>
        </div>

        {/* Inspection Info */}
        {inspectionData?.inspection && (
          <div className="bg-slate-50 p-4 rounded-lg mb-6 text-sm text-slate-700">
            <h3 className="font-semibold mb-2">Inspection Details:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <p>
                <span className="font-medium">Generator ID:</span>{" "}
                {inspectionData.inspection.generator?.generatorId}
              </p>
              <p>
                <span className="font-medium">Brand:</span>{" "}
                {inspectionData.inspection.generator?.brand}
              </p>
              <p>
                <span className="font-medium">Model:</span>{" "}
                {inspectionData.inspection.generator?.model}
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Overall Compliance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                Overall Compliance
              </label>
              <select
                value={formData.overallCompliance.toString()}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    overallCompliance: e.target.value === "true",
                  })
                }
                className="w-full border border-gray-300 text-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="true">Compliant</option>
                <option value="false">Non-Compliant</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                Compliance Score (0-100)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.complianceScore}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    complianceScore: Number(e.target.value),
                  })
                }
                className="w-full border border-gray-300 text-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>

          {/* Emissions Test */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-slate-700 mb-4">
              Emissions Test
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  Test Result
                </label>
                <select
                  value={formData.emissionsTest.passed.toString()}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emissionsTest: {
                        ...formData.emissionsTest,
                        passed: e.target.value === "true",
                      },
                    })
                  }
                  className="w-full border border-gray-300 text-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="true">Passed</option>
                  <option value="false">Failed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  CO2 Level (ppm)
                </label>
                <input
                  type="number"
                  value={formData.emissionsTest.co2Level}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emissionsTest: {
                        ...formData.emissionsTest,
                        co2Level: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full border border-gray-300 text-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  NOx Level (ppm)
                </label>
                <input
                  type="number"
                  value={formData.emissionsTest.noxLevel}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emissionsTest: {
                        ...formData.emissionsTest,
                        noxLevel: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full border border-gray-300 text-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  Particulate Level (µg/m³)
                </label>
                <input
                  type="number"
                  value={formData.emissionsTest.particulateLevel}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emissionsTest: {
                        ...formData.emissionsTest,
                        particulateLevel: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full border border-gray-300 text-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.emissionsTest.notes}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emissionsTest: {
                        ...formData.emissionsTest,
                        notes: e.target.value,
                      },
                    })
                  }
                  className="w-full border border-gray-300 text-slate-600 rounded-lg px-3 py-2 h-20 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Noise Level */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-slate-700 mb-4">
              Noise Level Test
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  Test Result
                </label>
                <select
                  value={formData.noiseLevel.passed.toString()}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      noiseLevel: {
                        ...formData.noiseLevel,
                        passed: e.target.value === "true",
                      },
                    })
                  }
                  className="w-full border border-gray-300 text-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="true">Passed</option>
                  <option value="false">Failed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  Decibel Reading (dB)
                </label>
                <input
                  type="number"
                  value={formData.noiseLevel.decibelReading}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      noiseLevel: {
                        ...formData.noiseLevel,
                        decibelReading: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full border border-gray-300 text-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.noiseLevel.notes}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      noiseLevel: {
                        ...formData.noiseLevel,
                        notes: e.target.value,
                      },
                    })
                  }
                  className="w-full border border-gray-300 text-slate-600 rounded-lg px-3 py-2 h-20 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Fuel Efficiency */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-slate-700 mb-4">
              Fuel Efficiency
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  Test Result
                </label>
                <select
                  value={formData.fuelEfficiency.passed.toString()}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fuelEfficiency: {
                        ...formData.fuelEfficiency,
                        passed: e.target.value === "true",
                      },
                    })
                  }
                  className="w-full border border-gray-300 text-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="true">Passed</option>
                  <option value="false">Failed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  Rating
                </label>
                <select
                  value={formData.fuelEfficiency.rating}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fuelEfficiency: {
                        ...formData.fuelEfficiency,
                        rating: e.target.value,
                      },
                    })
                  }
                  className="w-full border border-gray-300 text-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select Rating</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.fuelEfficiency.notes}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fuelEfficiency: {
                        ...formData.fuelEfficiency,
                        notes: e.target.value,
                      },
                    })
                  }
                  className="w-full border border-gray-300 text-slate-600 rounded-lg px-3 py-2 h-20 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Maintenance Status */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-slate-700 mb-4">
              Maintenance Status
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  Status
                </label>
                <select
                  value={formData.maintenanceStatus.passed.toString()}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maintenanceStatus: {
                        ...formData.maintenanceStatus,
                        passed: e.target.value === "true",
                      },
                    })
                  }
                  className="w-full border border-gray-300 text-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="true">Passed</option>
                  <option value="false">Failed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  Issues
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newMaintenanceIssue}
                    onChange={(e) => setNewMaintenanceIssue(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addItem(
                          newMaintenanceIssue,
                          setNewMaintenanceIssue,
                          formData.maintenanceStatus.issues,
                          "maintenanceStatus"
                        );
                      }
                    }}
                    className="flex-1 border border-gray-300 text-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Add maintenance issue..."
                  />
                  <button
                    type="button"
                    onClick={() =>
                      addItem(
                        newMaintenanceIssue,
                        setNewMaintenanceIssue,
                        formData.maintenanceStatus.issues,
                        "maintenanceStatus"
                      )
                    }
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
                  >
                    Add
                  </button>
                </div>
                {formData.maintenanceStatus.issues.length > 0 && (
                  <div className="space-y-2">
                    {formData.maintenanceStatus.issues.map((issue, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded"
                      >
                        <span className="text-sm text-slate-700">{issue}</span>
                        <button
                          type="button"
                          onClick={() =>
                            removeItem(
                              index,
                              formData.maintenanceStatus.issues,
                              "maintenanceStatus"
                            )
                          }
                          className="text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.maintenanceStatus.notes}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maintenanceStatus: {
                        ...formData.maintenanceStatus,
                        notes: e.target.value,
                      },
                    })
                  }
                  className="w-full border border-gray-300 text-slate-600 rounded-lg px-3 py-2 h-20 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Safety Compliance */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-slate-700 mb-4">
              Safety Compliance
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  Status
                </label>
                <select
                  value={formData.safetyCompliance.passed.toString()}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      safetyCompliance: {
                        ...formData.safetyCompliance,
                        passed: e.target.value === "true",
                      },
                    })
                  }
                  className="w-full border border-gray-300 text-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="true">Passed</option>
                  <option value="false">Failed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  Issues
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newSafetyIssue}
                    onChange={(e) => setNewSafetyIssue(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addItem(
                          newSafetyIssue,
                          setNewSafetyIssue,
                          formData.safetyCompliance.issues,
                          "safetyCompliance"
                        );
                      }
                    }}
                    className="flex-1 border border-gray-300 text-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Add safety issue..."
                  />
                  <button
                    type="button"
                    onClick={() =>
                      addItem(
                        newSafetyIssue,
                        setNewSafetyIssue,
                        formData.safetyCompliance.issues,
                        "safetyCompliance"
                      )
                    }
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
                  >
                    Add
                  </button>
                </div>
                {formData.safetyCompliance.issues.length > 0 && (
                  <div className="space-y-2">
                    {formData.safetyCompliance.issues.map((issue, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded"
                      >
                        <span className="text-sm text-slate-700">{issue}</span>
                        <button
                          type="button"
                          onClick={() =>
                            removeItem(
                              index,
                              formData.safetyCompliance.issues,
                              "safetyCompliance"
                            )
                          }
                          className="text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.safetyCompliance.notes}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      safetyCompliance: {
                        ...formData.safetyCompliance,
                        notes: e.target.value,
                      },
                    })
                  }
                  className="w-full border border-gray-300 text-slate-600 rounded-lg px-3 py-2 h-20 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-slate-700 mb-4">
              Recommendations
            </h3>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newRecommendation}
                onChange={(e) => setNewRecommendation(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addItem(
                      newRecommendation,
                      setNewRecommendation,
                      formData.recommendations,
                      "recommendations"
                    );
                  }
                }}
                className="flex-1 border border-gray-300 text-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Add recommendation..."
              />
              <button
                type="button"
                onClick={() =>
                  addItem(
                    newRecommendation,
                    setNewRecommendation,
                    formData.recommendations,
                    "recommendations"
                  )
                }
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
              >
                Add
              </button>
            </div>
            {formData.recommendations.length > 0 && (
              <div className="space-y-2">
                {formData.recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded"
                  >
                    <span className="text-sm text-slate-700">{rec}</span>
                    <button
                      type="button"
                      onClick={() =>
                        removeItem(
                          index,
                          formData.recommendations,
                          "recommendations"
                        )
                      }
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Required Actions */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-slate-700 mb-4">
              Required Actions
            </h3>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newRequiredAction}
                onChange={(e) => setNewRequiredAction(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addItem(
                      newRequiredAction,
                      setNewRequiredAction,
                      formData.requiredActions,
                      "requiredActions"
                    );
                  }
                }}
                className="flex-1 border border-gray-300 text-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Add required action..."
              />
              <button
                type="button"
                onClick={() =>
                  addItem(
                    newRequiredAction,
                    setNewRequiredAction,
                    formData.requiredActions,
                    "requiredActions"
                  )
                }
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
              >
                Add
              </button>
            </div>
            {formData.requiredActions.length > 0 && (
              <div className="space-y-2">
                {formData.requiredActions.map((action, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded"
                  >
                    <span className="text-sm text-slate-700">{action}</span>
                    <button
                      type="button"
                      onClick={() =>
                        removeItem(
                          index,
                          formData.requiredActions,
                          "requiredActions"
                        )
                      }
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Next Inspection Date */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Next Inspection Date
            </label>
            <input
              type="date"
              value={formData.nextInspectionDate}
              onChange={(e) =>
                setFormData({ ...formData, nextInspectionDate: e.target.value })
              }
              className="w-full md:w-1/2 border border-gray-300 text-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate("/admin/inspections")}
              className="px-6 py-2 rounded-lg border border-gray-300 text-slate-600 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="flex items-center gap-2 px-6 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition disabled:opacity-50"
            >
              <Save size={18} />
              {isCreating ? "Creating..." : "Create Report"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default WriteReport;
