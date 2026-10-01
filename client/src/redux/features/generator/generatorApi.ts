import { apiSlice } from "../api/apiSlice";

export const generatorApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    registerGenerator: builder.mutation({
      query: (data) => ({
        url: "generator/register",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Generator", id: "LIST" }],
    }),
    getAllGenerators: builder.query({
      query: ({ page = 1, pageSize = 10 }) => ({
        url: `generators?page=${page}&pageSize=${pageSize}`,
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: [{ type: "Generator", id: "LIST" }],
    }),
    getGeneratorById: builder.query({
      query: ({ id }) => ({
        url: `generator/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: [{ type: "Generator", id: "LIST" }],
    }),
    getMyGenerators: builder.query({
      query: () => ({
        url: "generators/me",
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: [{ type: "Generator", id: "LIST" }],
    }),
    updateGenerator: builder.mutation({
      query: ({ id, data }) => ({
        url: `generator/update/${id}`,
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Generator", id: "LIST" }],
    }),
    updateGeneratorStatus: builder.mutation({
      query: ({ id, data }) => ({
        url: `generator/update/status/${id}`,
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Generator", id: "LIST" }],
    }),
    deleteGenerator: builder.mutation({
      query: (id) => ({
        url: `generator/delete/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Generator", id: "LIST" }],
    }),
  }),
});

export const {
  useRegisterGeneratorMutation,
  useGetAllGeneratorsQuery,
  useGetGeneratorByIdQuery,
  useGetMyGeneratorsQuery,
  useUpdateGeneratorMutation,
  useUpdateGeneratorStatusMutation,
  useDeleteGeneratorMutation,
} = generatorApi;
