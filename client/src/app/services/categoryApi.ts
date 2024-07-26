import { api } from "./api";

export interface ICategory {
  name: string;
  id: string;
  userId: string;
  transactions: { amount: number; name: string; type: string }[];
}

export const categoryApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getAllCategories: build.query<ICategory[], void>({
      query: () => ({
        url: "/categories",
        method: "GET",
      }),
      providesTags: ["category"],
    }),

    updateCategory: build.mutation<ICategory, { name: string; id: string }>({
      query: ({ name, id }) => ({
        url: `/categories/${id}`,
        method: "PUT",
        body: { name },
      }),
      invalidatesTags: ["transaction", "category"],
    }),

    deleteCategory: build.mutation<void, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["transaction", "category"],
    }),
  }),
});

export const {
  useGetAllCategoriesQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
export const {
  endpoints: { getAllCategories, updateCategory, deleteCategory },
} = categoryApi;
