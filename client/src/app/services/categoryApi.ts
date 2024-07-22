import { ITransaction } from "src/components/Transactions/Transactions";
import { ByMonth, Category, Transaction, User } from "../types";
import { api } from "./api";

export interface ICategory {
  name: string;
}

export const categoryApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAllCategories: build.query<ICategory[], void>({
      query: () => ({
        url: "/categories",
        method: "GET",
      }),
      providesTags: ["category"],
    }),
  }),
});

export const { useGetAllCategoriesQuery } = categoryApi;
export const {
  endpoints: { getAllCategories },
} = categoryApi;
