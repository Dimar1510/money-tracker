import { ITransaction } from "src/components/Transactions/Transactions";
import { ByMonth, Category, Transaction, User } from "../types";
import { api } from "./api";

type GetTransactions = {
  transactions: Transaction[];
  totalExpenseByCategory: Category[];
  totalExpenseByMonth: ByMonth[];
};

export const transactionApi = api.injectEndpoints({
  endpoints: (build) => ({
    createTransaction: build.mutation<Transaction, { itemData: ITransaction }>({
      query: ({ itemData }) => ({
        url: "/transactions",
        method: "POST",
        body: itemData,
      }),
      invalidatesTags: ["transaction", "category"],
    }),
    updateTransaction: build.mutation<
      Transaction,
      { itemData: ITransaction; id: string }
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
      invalidatesTags: ["transaction"],
    }),
  }),
});

export const {
  useGetAllTransactionsQuery,
  useCreateTransactionMutation,
  useDeleteTransactionMutation,
  useUpdateTransactionMutation,
} = transactionApi;
export const {
  endpoints: {
    createTransaction,
    getAllTransactions,
    deleteTransaction,
    updateTransaction,
  },
} = transactionApi;
