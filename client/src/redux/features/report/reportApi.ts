import { apiSlice } from "../api/apiSlice";

export const reportApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createInspectionReport: builder.mutation({
      query: (data) => ({
        url: "report/create",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Report", id: "LIST" }],
    }),
    getAllReports: builder.query({
      query: ({ page = 1, pageSize = 10 }) => ({
        url: `reports?page=${page}&pageSize=${pageSize}`,
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
        url: `report/${inspectionId}`,
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: [{ type: "Report", id: "LIST" }],
    }),
    getMyReports: builder.query({
      query: () => ({
        url: "reports/me",
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: [{ type: "Report", id: "LIST" }],
    }),
    updateInspectionReport: builder.mutation({
      query: ({ id, data }) => ({
        url: `report/inspection/update/${id}`,
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Report", id: "LIST" }],
    }),
    approveInspectionReport: builder.mutation({
      query: ({ id, data }) => ({
        url: `report/approve/${id}`,
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Report", id: "LIST" }],
    }),
    deleteInspectionReport: builder.mutation({
      query: (id) => ({
        url: `report/delete/${id}`,
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
