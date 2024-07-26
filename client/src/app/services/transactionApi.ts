import { ITransactionFormItem } from "src/components/Transactions/Transactions";
import { ByMonth, ByYear, Category, Transaction, User } from "../types";
import { api } from "./api";

type GetTransactions = {
  transactions: Transaction[];
  byYearData: ByYear[];
};

export const transactionApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    createTransaction: build.mutation<
      Transaction,
      { itemData: ITransactionFormItem }
    >({
      query: ({ itemData }) => ({
        url: "/transactions",
        method: "POST",
        body: itemData,
      }),
      invalidatesTags: ["transaction", "category"],
    }),
    updateTransaction: build.mutation<
      Transaction,
      { itemData: ITransactionFormItem; id: string }
    >({
      query: ({ itemData, id }) => ({
        url: `/transactions/${id}`,
        method: "PUT",
        body: itemData,
      }),
      invalidatesTags: ["transaction", "category"],
    }),
    getAllTransactions: build.query<GetTransactions, void>({
      query: () => ({
        url: "/transactions",
        method: "GET",
      }),
      providesTags: ["transaction"],
    }),

    deleteTransaction: build.mutation<void, { ids: string[] }>({
      query: ({ ids }) => ({
        url: `/transactions`,
        method: "DELETE",
        body: ids,
      }),
      invalidatesTags: ["transaction", "category"],
    }),

    populate: build.mutation<void, void>({
      query: () => ({
        url: "/transactions/populate",
        method: "POST",
      }),
      invalidatesTags: ["transaction", "category"],
    }),
  }),
});

export const {
  useGetAllTransactionsQuery,
  useCreateTransactionMutation,
  useDeleteTransactionMutation,
  useUpdateTransactionMutation,
  usePopulateMutation,
} = transactionApi;
export const {
  endpoints: {
    createTransaction,
    getAllTransactions,
    deleteTransaction,
    updateTransaction,
    populate,
  },
} = transactionApi;
