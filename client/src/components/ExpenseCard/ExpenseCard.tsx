import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { useGetAllTransactionsQuery } from "src/app/services/transactionApi";
import { ITransaction } from "../Transactions/Transactions";

const ExpenseCard = () => {
  const { data } = useGetAllTransactionsQuery();
  let expense = 0;
  data?.transactions.forEach((item) => {
    if (item.type === "expense") {
      expense += item.amount;
    }
  });

  return (
    <>
      <Card className="max-w-[400px] flex-1">
        <CardHeader className="flex gap-3">
          <h3 className="text-md">Расходы за все время</h3>
        </CardHeader>
        <CardBody>
          <p>₽ {expense}</p>
        </CardBody>
      </Card>
    </>
  );
};

export default ExpenseCard;
