import { apiSlice } from "../api/apiSlice";

export const reportApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createInspectionReport: builder.mutation({
      query: (data) => ({
        url: "create-report",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Report", id: "LIST" }],
    }),
    getAllReports: builder.query({
      query: ({ page = 1, pageSize = 10 }) => ({
        url: `get-all-reports?page=${page}&pageSize=${pageSize}`,
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: [{ type: "Report", id: "LIST" }],
    }),
    getReportById: builder.query({
      query: ({ id }) => ({
        url: `report/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: [{ type: "Report", id: "LIST" }],
    }),
    getReportByInspectionId: builder.query({
      query: (inspectionId) => ({
        url: `inspection/${inspectionId}`,
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: [{ type: "Report", id: "LIST" }],
    }),
    getMyReports: builder.query({
      query: () => ({
        url: "my-reports",
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: [{ type: "Report", id: "LIST" }],
    }),
    updateInspectionReport: builder.mutation({
      query: ({ id, data }) => ({
        url: `update-inspection-report/${id}`,
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Report", id: "LIST" }],
    }),
    approveInspectionReport: builder.mutation({
      query: ({ id, data }) => ({
        url: `approve-report/${id}`,
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Report", id: "LIST" }],
    }),
    deleteInspectionReport: builder.mutation({
      query: (id) => ({
        url: `delete-report/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Inspection", id: "LIST" }],
    }),
  }),
});

export const {
  useCreateInspectionReportMutation,
  useGetAllReportsQuery,
  useGetMyReportsQuery,
  useGetReportByIdQuery,
  useGetReportByInspectionIdQuery,
  useApproveInspectionReportMutation,
  useUpdateInspectionReportMutation,
  useDeleteInspectionReportMutation,
} = reportApi;
