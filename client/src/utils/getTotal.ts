import { useMemo } from "react";
import { useGetAllTransactionsQuery } from "src/app/services/transactionApi";

export const useGetTotal = () => {
  const { data } = useGetAllTransactionsQuery();

  const { income, expense, balance } = useMemo(() => {
    let income = 0;
    let expense = 0;

    if (data) {
      data.transactions.forEach((item) => {
        if (item.type === "income") {
          income += item.amount;
        } else {
          expense += item.amount;
        }
      });
    }

    return { income, expense, balance: income - expense };
  }, [data]);

  return { income, expense, balance };
};
