import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { useGetAllTransactionsQuery } from "src/app/services/transactionApi";
import { BsGraphDownArrow } from "react-icons/bs";
import { BsGraphUpArrow } from "react-icons/bs";
import { GoGraph } from "react-icons/go";
import { ReactElement } from "react";
import { FaRubleSign } from "react-icons/fa";
import { useGetTotal } from "src/utils/getTotal";

const InfoCard = ({
  amount,
  title,
  icon,
  href,
}: {
  amount: number;
  title: string;
  icon: ReactElement;
  href: string;
}) => {
  return (
    <a
      className="flex-1 items-center hover:scale-105 will-change-transform transition-transform"
      href={"#" + href}
    >
      <Card shadow="sm">
        <CardHeader className="justify-center gap-2 items-center">
          {icon}
          <h3 className="text-md">{title}</h3>
        </CardHeader>
        <CardBody className="items-center">
          <p className="flex items-center gap-1">
            <FaRubleSign />
            {amount.toLocaleString()}
          </p>
        </CardBody>
      </Card>
    </a>
  );
};

const InfoCards = () => {
  const { balance, expense, income } = useGetTotal();
  return (
    <div className="flex justify-between gap-2 sm:gap-8 flex-col sm:flex-row">
      <InfoCard
        href="balance"
        title="Баланс"
        amount={balance}
        icon={<GoGraph className="text-primary" />}
      />
      <InfoCard
        href="byYear"
        title="Расходы"
        amount={expense}
        icon={<BsGraphDownArrow className="text-danger-500" />}
      />
      <InfoCard
        href="byCategory"
        title="Доходы"
        amount={income}
        icon={<BsGraphUpArrow className="text-success-500" />}
      />
    </div>
  );
};

export default InfoCards;
