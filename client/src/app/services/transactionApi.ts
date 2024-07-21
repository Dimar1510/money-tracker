import { ByMonth, Category, Transaction, User } from "../types";
import { api } from "./api";

type GetTransactions = {
  transactions: Transaction[];
  categories: Category[];
  byMonth: ByMonth[];
};

export const userApi = api.injectEndpoints({
  endpoints: (build) => ({
    createTransaction: build.mutation<Transaction, Transaction>({
      query: (userData) => ({
        url: "/transactions",
        method: "POST",
        body: userData,
      }),
    }),

    getAllTransactions: build.query<GetTransactions, void>({
      query: () => ({
        url: "/transactions",
        method: "GET",
      }),
      providesTags: ["transaction"],
    }),
  }),
});

export const { useGetAllTransactionsQuery, useCreateTransactionMutation } =
  userApi;
export const {
  endpoints: { createTransaction, getAllTransactions },
} = userApi;
