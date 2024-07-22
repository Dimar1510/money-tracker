import { Card, CardBody, CardHeader } from "@nextui-org/react";

const IncomeCard = () => {
  return (
    <Card className="max-w-[400px]">
      <CardHeader className="flex gap-3">
        <h2 className="text-md">Total income</h2>
      </CardHeader>
      <CardBody>
        <p>10000</p>
      </CardBody>
    </Card>
  );
};

export default IncomeCard;
