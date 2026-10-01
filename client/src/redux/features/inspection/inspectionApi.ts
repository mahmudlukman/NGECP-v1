import { apiSlice } from "../api/apiSlice";

export const inspectionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    scheduleInspection: builder.mutation({
      query: (data) => ({
        url: "inspection/schedule",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Inspection", id: "LIST" }],
    }),
    getAllInspections: builder.query({
      query: ({ page = 1, pageSize = 10 }) => ({
        url: `inspections?page=${page}&pageSize=${pageSize}`,
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: [{ type: "Inspection", id: "LIST" }],
    }),
    getInspectionById: builder.query({
      query: (id) => ({
        url: `inspection/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: [{ type: "Inspection", id: "LIST" }],
    }),
    getMyInspections: builder.query({
      query: () => ({
        url: "inspections/me",
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: [{ type: "Inspection", id: "LIST" }],
    }),
    getInspectionFee: builder.query({
      query: () => ({
        url: "inspection/fee",
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: [{ type: "Inspection", id: "LIST" }],
    }),
    updateInspectionFee: builder.mutation({
      query: ({ data }) => ({
        url: "inspection/update/fee",
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Inspection", id: "LIST" }],
    }),
    assignInspector: builder.mutation({
      query: ({ id, data }) => ({
        url: `inspector/assign/${id}`,
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Inspection", id: "LIST" }],
    }),
    updateInspectionStatus: builder.mutation({
      query: ({ id, data }) => ({
        url: `inspection/update/status/${id}`,
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Inspection", id: "LIST" }],
    }),
    cancelInspection: builder.mutation({
      query: (id) => ({
        url: `inspection/cancel/${id}`,
        method: "PUT",
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Inspection", id: "LIST" }],
    }),
    deleteInspection: builder.mutation({
      query: (id) => ({
        url: `inspection/delete/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Inspection", id: "LIST" }],
    }),
  }),
});

export const {
  useScheduleInspectionMutation,
  useGetAllInspectionsQuery,
  useGetInspectionByIdQuery,
  useGetMyInspectionsQuery,
  useGetInspectionFeeQuery,
  useUpdateInspectionFeeMutation,
  useUpdateInspectionStatusMutation,
  useAssignInspectorMutation,
  useCancelInspectionMutation,
  useDeleteInspectionMutation,
} = inspectionApi;
