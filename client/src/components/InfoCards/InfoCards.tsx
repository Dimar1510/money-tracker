import { Card, CardBody, CardHeader } from "@nextui-org/react";
import React from "react";
import { useGetAllTransactionsQuery } from "src/app/services/transactionApi";

const InfoCard = ({ amount, title }: { amount: number; title: string }) => {
  return (
    <Card className="max-w-[400px] flex-1 items-center">
      <CardHeader className="justify-center">
        <h3 className="text-md">{title}</h3>
      </CardHeader>
      <CardBody className="items-center">
        <p>{amount}</p>
      </CardBody>
    </Card>
  );
};

const InfoCards = () => {
  const { data } = useGetAllTransactionsQuery();
  let income = 0;
  let expense = 0;
  data?.transactions.forEach((item) => {
    if (item.type === "income") {
      income += item.amount;
    } else {
      expense += item.amount;
    }
  });
  return (
    <div className="flex justify-between gap-8">
      <InfoCard title="Баланс" amount={income - expense} />
      <InfoCard title="Расходы" amount={income} />
      <InfoCard title="Доходы" amount={expense} />
    </div>
  );
};

export default InfoCards;
