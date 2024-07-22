import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react";

const BalanceCard = () => {
  return (
    <Card className="max-w-[400px]">
      <CardHeader className="flex gap-3">
        <h2 className="text-md">Tracked balance</h2>
      </CardHeader>
      <CardBody>
        <p>10000</p>
      </CardBody>
    </Card>
  );
};

export default BalanceCard;
