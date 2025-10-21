"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardAnalytics = void 0;
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const User_1 = require("../models/User");
const Generator_1 = require("../models/Generator");
const Inspection_1 = require("../models/Inspection");
const Payment_1 = require("../models/Payment");
const InspectionReport_1 = require("../models/InspectionReport");
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
// Get comprehensive dashboard analytics
exports.getDashboardAnalytics = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
    try {
        // ============= USER STATISTICS =============
        const [totalUsers, activeUsers, inactiveUsers, individualUsers, companyUsers] = await Promise.all([
            User_1.User.countDocuments(),
            User_1.User.countDocuments({ isActive: true }),
            User_1.User.countDocuments({ isActive: false }),
            User_1.User.countDocuments({ accountType: "individual" }),
            User_1.User.countDocuments({ accountType: "company" }),
        ]);
        // Users by month
        const usersByMonth = await User_1.User.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                    },
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    month: {
                        $concat: [
                            { $toString: "$_id.year" },
                            "-",
                            {
                                $cond: {
                                    if: { $lt: ["$_id.month", 10] },
                                    then: { $concat: ["0", { $toString: "$_id.month" }] },
                                    else: { $toString: "$_id.month" },
                                },
                            },
                        ],
                    },
                    count: 1,
                },
            },
            { $sort: { month: 1 } },
        ]);
        // ============= GENERATOR STATISTICS =============
        const [totalGenerators, activeGenerators, inactiveGenerators, compliantGenerators, nonCompliantGenerators, underInspectionGenerators, avgComplianceScore, generatorsByState, generatorsByFuelType,] = await Promise.all([
            Generator_1.Generator.countDocuments(),
            Generator_1.Generator.countDocuments({ status: "active" }),
            Generator_1.Generator.countDocuments({ status: "inactive" }),
            Generator_1.Generator.countDocuments({ status: "compliant" }),
            Generator_1.Generator.countDocuments({ status: "non_compliant" }),
            Generator_1.Generator.countDocuments({ status: "under_inspection" }),
            Generator_1.Generator.aggregate([
                { $match: { complianceScore: { $exists: true, $ne: null } } },
                { $group: { _id: null, avgScore: { $avg: "$complianceScore" } } },
            ]),
            Generator_1.Generator.aggregate([
                { $group: { _id: "$location.state", count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 5 },
            ]),
            Generator_1.Generator.aggregate([
                { $group: { _id: "$fuelType", count: { $sum: 1 } } },
                { $sort: { count: -1 } },
            ]),
        ]);
        // Generators by month
        const generatorsByMonth = await Generator_1.Generator.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                    },
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    month: {
                        $concat: [
                            { $toString: "$_id.year" },
                            "-",
                            {
                                $cond: {
                                    if: { $lt: ["$_id.month", 10] },
                                    then: { $concat: ["0", { $toString: "$_id.month" }] },
                                    else: { $toString: "$_id.month" },
                                },
                            },
                        ],
                    },
                    count: 1,
                },
            },
            { $sort: { month: 1 } },
        ]);
        const complianceRate = totalGenerators > 0
            ? ((compliantGenerators / totalGenerators) * 100).toFixed(1)
            : "0";
        // ============= INSPECTION STATISTICS =============
        const [totalInspections, pendingInspections, scheduledInspections, completedInspections, cancelledInspections,] = await Promise.all([
            Inspection_1.Inspection.countDocuments(),
            Inspection_1.Inspection.countDocuments({ status: "pending" }),
            Inspection_1.Inspection.countDocuments({ status: "scheduled" }),
            Inspection_1.Inspection.countDocuments({ status: "completed" }),
            Inspection_1.Inspection.countDocuments({ status: "cancelled" }),
        ]);
        // Inspections by month
        const inspectionsByMonth = await Inspection_1.Inspection.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                    },
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    month: {
                        $concat: [
                            { $toString: "$_id.year" },
                            "-",
                            {
                                $cond: {
                                    if: { $lt: ["$_id.month", 10] },
                                    then: { $concat: ["0", { $toString: "$_id.month" }] },
                                    else: { $toString: "$_id.month" },
                                },
                            },
                        ],
                    },
                    count: 1,
                },
            },
            { $sort: { month: 1 } },
        ]);
        const completionRate = totalInspections > 0
            ? ((completedInspections / totalInspections) * 100).toFixed(1)
            : "0";
        // ============= PAYMENT STATISTICS =============
        const [totalPayments, paidPayments, pendingPayments, failedPayments, revenueData] = await Promise.all([
            Payment_1.Payment.countDocuments(),
            Payment_1.Payment.countDocuments({ status: "paid" }),
            Payment_1.Payment.countDocuments({ status: "pending" }),
            Payment_1.Payment.countDocuments({ status: "failed" }),
            Payment_1.Payment.aggregate([
                { $match: { status: "paid" } },
                { $group: { _id: null, total: { $sum: "$amount" } } },
            ]),
        ]);
        // Revenue by month
        const revenueByMonth = await Payment_1.Payment.aggregate([
            {
                $match: {
                    status: "paid",
                    paymentDate: { $exists: true, $ne: null },
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$paymentDate" },
                        month: { $month: "$paymentDate" },
                    },
                    revenue: { $sum: "$amount" },
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    month: {
                        $concat: [
                            { $toString: "$_id.year" },
                            "-",
                            {
                                $cond: {
                                    if: { $lt: ["$_id.month", 10] },
                                    then: { $concat: ["0", { $toString: "$_id.month" }] },
                                    else: { $toString: "$_id.month" },
                                },
                            },
                        ],
                    },
                    revenue: 1,
                    count: 1,
                },
            },
            { $sort: { month: 1 } },
        ]);
        const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;
        // ============= REPORT STATISTICS =============
        const [totalReports, approvedReports, pendingApprovalReports, compliantReports, nonCompliantReports, commonIssues,] = await Promise.all([
            InspectionReport_1.InspectionReport.countDocuments(),
            InspectionReport_1.InspectionReport.countDocuments({ isApproved: true }),
            InspectionReport_1.InspectionReport.countDocuments({ isApproved: false }),
            InspectionReport_1.InspectionReport.countDocuments({ overallCompliance: true }),
            InspectionReport_1.InspectionReport.countDocuments({ overallCompliance: false }),
            InspectionReport_1.InspectionReport.aggregate([
                { $unwind: "$maintenanceStatus.issues" },
                {
                    $group: {
                        _id: "$maintenanceStatus.issues",
                        count: { $sum: 1 },
                    },
                },
                { $sort: { count: -1 } },
                { $limit: 5 },
            ]),
        ]);
        // ============= COMPLIANCE BREAKDOWN =============
        const complianceBreakdown = await InspectionReport_1.InspectionReport.aggregate([
            {
                $group: {
                    _id: null,
                    totalEmissionsPassed: {
                        $sum: { $cond: ["$emissionsTest.passed", 1, 0] },
                    },
                    totalNoisePassed: {
                        $sum: { $cond: ["$noiseLevel.passed", 1, 0] },
                    },
                    totalFuelEfficiencyPassed: {
                        $sum: { $cond: ["$fuelEfficiency.passed", 1, 0] },
                    },
                    totalMaintenancePassed: {
                        $sum: { $cond: ["$maintenanceStatus.passed", 1, 0] },
                    },
                    totalSafetyPassed: {
                        $sum: { $cond: ["$safetyCompliance.passed", 1, 0] },
                    },
                    totalReports: { $sum: 1 },
                },
            },
        ]);
        const complianceMetrics = complianceBreakdown.length > 0
            ? {
                emissions: parseFloat(((complianceBreakdown[0].totalEmissionsPassed /
                    complianceBreakdown[0].totalReports) *
                    100).toFixed(1)),
                noise: parseFloat(((complianceBreakdown[0].totalNoisePassed /
                    complianceBreakdown[0].totalReports) *
                    100).toFixed(1)),
                fuelEfficiency: parseFloat(((complianceBreakdown[0].totalFuelEfficiencyPassed /
                    complianceBreakdown[0].totalReports) *
                    100).toFixed(1)),
                maintenance: parseFloat(((complianceBreakdown[0].totalMaintenancePassed /
                    complianceBreakdown[0].totalReports) *
                    100).toFixed(1)),
                safety: parseFloat(((complianceBreakdown[0].totalSafetyPassed /
                    complianceBreakdown[0].totalReports) *
                    100).toFixed(1)),
            }
            : {
                emissions: 0,
                noise: 0,
                fuelEfficiency: 0,
                maintenance: 0,
                safety: 0,
            };
        // ============= RECENT ACTIVITY =============
        const [recentInspections, recentPayments, recentReports] = await Promise.all([
            Inspection_1.Inspection.find()
                .populate("generator", "generatorId brand model")
                .populate("owner", "name email companyName accountType")
                .sort({ createdAt: -1 })
                .limit(5)
                .lean(),
            Payment_1.Payment.find({ status: "paid" })
                .populate("user", "name email companyName accountType")
                .sort({ paymentDate: -1 })
                .limit(5)
                .lean(),
            InspectionReport_1.InspectionReport.find()
                .populate("generator", "generatorId brand model")
                .populate("inspector", "name email")
                .sort({ createdAt: -1 })
                .limit(5)
                .lean(),
        ]);
        // ============= RESPONSE =============
        res.status(200).json({
            success: true,
            analytics: {
                // Overview Summary
                overview: {
                    totalUsers,
                    totalGenerators,
                    totalInspections,
                    totalRevenue,
                    complianceRate: parseFloat(complianceRate),
                    completionRate: parseFloat(completionRate),
                },
                // User Analytics
                users: {
                    total: totalUsers,
                    active: activeUsers,
                    inactive: inactiveUsers,
                    byAccountType: {
                        individual: individualUsers,
                        company: companyUsers,
                    },
                    usersByMonth,
                },
                // Generator Analytics
                generators: {
                    total: totalGenerators,
                    active: activeGenerators,
                    inactive: inactiveGenerators,
                    compliant: compliantGenerators,
                    nonCompliant: nonCompliantGenerators,
                    underInspection: underInspectionGenerators,
                    averageComplianceScore: avgComplianceScore.length > 0
                        ? Math.round(avgComplianceScore[0].avgScore * 10) / 10
                        : 0,
                    complianceRate: parseFloat(complianceRate),
                    byState: generatorsByState.map((s) => ({
                        name: s._id,
                        count: s.count,
                    })),
                    byFuelType: generatorsByFuelType.map((f) => ({
                        name: f._id,
                        count: f.count,
                    })),
                    generatorsByMonth,
                },
                // Inspection Analytics
                inspections: {
                    total: totalInspections,
                    pending: pendingInspections,
                    scheduled: scheduledInspections,
                    completed: completedInspections,
                    cancelled: cancelledInspections,
                    completionRate: parseFloat(completionRate),
                    byStatus: [
                        { name: "Pending", count: pendingInspections },
                        { name: "Scheduled", count: scheduledInspections },
                        { name: "Completed", count: completedInspections },
                        { name: "Cancelled", count: cancelledInspections },
                    ],
                    inspectionsByMonth,
                },
                // Payment Analytics
                payments: {
                    total: totalPayments,
                    paid: paidPayments,
                    pending: pendingPayments,
                    failed: failedPayments,
                    revenue: {
                        total: totalRevenue,
                    },
                    byStatus: [
                        { name: "Paid", amount: paidPayments },
                        { name: "Pending", amount: pendingPayments },
                        { name: "Failed", amount: failedPayments },
                    ],
                    revenueByMonth,
                },
                // Report Analytics
                reports: {
                    total: totalReports,
                    approved: approvedReports,
                    pendingApproval: pendingApprovalReports,
                    compliant: compliantReports,
                    nonCompliant: nonCompliantReports,
                    complianceMetrics,
                    commonIssues: commonIssues.map((issue) => ({
                        name: issue._id,
                        count: issue.count,
                    })),
                },
                // Chart Data - Formatted for frontend
                chartData: {
                    // Revenue by month for bar chart
                    revenueByMonth: revenueByMonth.map((d) => ({
                        month: d.month,
                        amount: d.revenue,
                        category: "Revenue",
                    })),
                    // User growth for line chart
                    usersByMonth: usersByMonth.map((d) => ({
                        month: d.month,
                        count: d.count,
                    })),
                    // Inspections by month for line chart
                    inspectionsByMonth: inspectionsByMonth.map((d) => ({
                        month: d.month,
                        count: d.count,
                    })),
                    // Generators by state for pie chart
                    generatorsByState: generatorsByState.map((s) => ({
                        name: s._id,
                        amount: s.count,
                    })),
                    // Generators by fuel type for pie chart
                    generatorsByFuelType: generatorsByFuelType.map((f) => ({
                        name: f._id,
                        amount: f.count,
                    })),
                    // Inspection status for pie chart
                    inspectionsByStatus: [
                        { name: "Pending", amount: pendingInspections },
                        { name: "Scheduled", amount: scheduledInspections },
                        { name: "Completed", amount: completedInspections },
                        { name: "Cancelled", amount: cancelledInspections },
                    ],
                    // Compliance metrics for pie chart
                    complianceByCategory: [
                        { name: "Emissions", amount: complianceMetrics.emissions },
                        { name: "Noise", amount: complianceMetrics.noise },
                        { name: "Fuel Efficiency", amount: complianceMetrics.fuelEfficiency },
                        { name: "Maintenance", amount: complianceMetrics.maintenance },
                        { name: "Safety", amount: complianceMetrics.safety },
                    ],
                },
                // Recent Activity
                recentActivity: {
                    inspections: recentInspections,
                    payments: recentPayments,
                    reports: recentReports,
                },
            },
            timestamp: new Date(),
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
});
