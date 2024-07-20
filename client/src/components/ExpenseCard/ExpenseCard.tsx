import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import FormInput from "../ui/FormInput/FormInput";
import { useForm } from "react-hook-form";
import ErrorMessage from "../ui/error-message/ErrorMessage";
import { useState } from "react";

const ExpenseCard = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [error, setError] = useState("");
  const { handleSubmit, control, getValues } = useForm({
    mode: "onChange",
    reValidateMode: "onBlur",
  });
  return (
    <>
      <Card className="max-w-[400px]">
        <CardHeader className="flex gap-3">
          <h2 className="text-md">Total expenses</h2>
        </CardHeader>
        <Divider />
        <CardBody>
          <p>10000</p>
        </CardBody>
        <CardFooter>
          <Button onPress={onOpen} color="primary">
            Add expense
          </Button>
        </CardFooter>
      </Card>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add Expense
              </ModalHeader>
              <ModalBody>
                <form className="flex flex-col gap-4">
                  <FormInput
                    control={control}
                    name="name"
                    label="Name"
                    type="text"
                    required="Name required"
                  />
                  <FormInput
                    control={control}
                    name="amount"
                    label="Amount"
                    type="number"
                    required="Amount required"
                  />
                  <FormInput
                    control={control}
                    name="date"
                    label="Date"
                    type="date"
                    required="Date required"
                  />
                  <FormInput
                    control={control}
                    name="category"
                    label="Category"
                    type="text"
                    required="Category required"
                  />

                  <ErrorMessage error={error} />
                  <Button
                    type="submit"
                    className="w-full"
                    color="primary"
                    onPress={onClose}
                  >
                    Add expense
                  </Button>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ExpenseCard;
