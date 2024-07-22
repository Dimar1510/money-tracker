import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
import { useGetAllTransactionsQuery } from "src/app/services/transactionApi";

const BalanceCard = () => {
  const { data } = useGetAllTransactionsQuery();
  let balance = 0;
  data?.transactions.forEach((item) => {
    if (item.type === "income") {
      balance += item.amount;
    } else {
      balance -= item.amount;
    }
  });
  return (
    <Card className="max-w-[400px]">
      <CardHeader className="flex gap-3">
        <h3 className="text-md">Отслеживаемый баланс</h3>
      </CardHeader>
      <CardBody>
        <p>{balance}</p>
      </CardBody>
    </Card>
  );
};

export default BalanceCard;
