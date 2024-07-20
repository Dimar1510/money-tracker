import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
} from "@nextui-org/react";

const IncomeCard = () => {
  return (
    <Card className="max-w-[400px]">
      <CardHeader className="flex gap-3">
        <h2 className="text-md">Total income</h2>
      </CardHeader>
      <Divider />
      <CardBody>
        <p>10000</p>
      </CardBody>
      <CardFooter>
        <Button>Add income</Button>
      </CardFooter>
    </Card>
  );
};

export default IncomeCard;
