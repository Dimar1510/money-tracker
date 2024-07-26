import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { useGetAllTransactionsQuery } from "src/app/services/transactionApi";
import { BsGraphDownArrow } from "react-icons/bs";
import { BsGraphUpArrow } from "react-icons/bs";
import { GoGraph } from "react-icons/go";
import { ReactElement } from "react";
import { FaRubleSign } from "react-icons/fa";

const InfoCard = ({
  amount,
  title,
  icon,
}: {
  amount: number;
  title: string;
  icon: ReactElement;
}) => {
  return (
    <Card className="max-w-[400px] flex-1 items-center" shadow="sm">
      <CardHeader className="justify-center gap-2 items-center">
        {icon}
        <h3 className="text-md">{title}</h3>
      </CardHeader>
      <CardBody className="items-center">
        <p className="flex items-center gap-1">
          <FaRubleSign />
          {amount}
        </p>
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
      <InfoCard
        title="Баланс"
        amount={income - expense}
        icon={<GoGraph className="text-primary" />}
      />
      <InfoCard
        title="Расходы"
        amount={income}
        icon={<BsGraphDownArrow className="text-danger-500" />}
      />
      <InfoCard
        title="Доходы"
        amount={expense}
        icon={<BsGraphUpArrow className="text-success-500" />}
      />
    </div>
  );
};

export default InfoCards;
