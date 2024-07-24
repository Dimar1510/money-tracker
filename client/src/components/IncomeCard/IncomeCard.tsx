import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { useGetAllTransactionsQuery } from "src/app/services/transactionApi";

const IncomeCard = () => {
  const { data } = useGetAllTransactionsQuery();
  let income = 0;
  data?.transactions.forEach((item) => {
    if (item.type === "income") {
      income += item.amount;
    }
  });
  return (
    <Card className="max-w-[400px] flex-1">
      <CardHeader className="flex gap-3">
        <h3 className="text-md">Доходы за все время</h3>
      </CardHeader>
      <CardBody>
        <p>₽ {income}</p>
      </CardBody>
    </Card>
  );
};

export default IncomeCard;
