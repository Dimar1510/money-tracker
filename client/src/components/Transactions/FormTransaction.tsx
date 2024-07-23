import { FC, useState } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import {
  useCreateTransactionMutation,
  useDeleteTransactionMutation,
  useGetAllTransactionsQuery,
  useUpdateTransactionMutation,
} from "src/app/services/transactionApi";
import { Button } from "@nextui-org/react";
import ErrorMessage from "../ui/error-message/ErrorMessage";
import { Control, UseFormHandleSubmit, useForm } from "react-hook-form";
import FormInput from "../ui/FormInput/FormInput";
import { hasErrorField } from "src/utils/has-error-field";
import { ITransaction } from "./Transactions";
import FormSelect from "../ui/FormSelect/FormSelect";
import { useGetAllCategoriesQuery } from "src/app/services/categoryApi";
import FormCategory from "../ui/FormAutocomplete/FormAutocomplete";
import FormAutocomplete from "../ui/FormAutocomplete/FormAutocomplete";

interface IProps {
  error: string;
  setError: (err: string) => void;
  edit: string | null;
  setEdit: (id: string | null) => void;
  reset: () => void;
  handleSubmit: UseFormHandleSubmit<ITransaction, undefined>;
  control: Control<ITransaction, any>;
  onClose: () => void;
}

const FormTransaction: FC<IProps> = ({
  error,
  setError,
  edit,
  setEdit,
  reset,
  handleSubmit,
  control,
  onClose,
}) => {
  const [createTransaction] = useCreateTransactionMutation();
  const [updateTransaction] = useUpdateTransactionMutation();

  const onSubmit = async (data: ITransaction) => {
    try {
      if (edit) {
        await updateTransaction({
          itemData: { ...data },
          id: edit,
        }).unwrap();
      } else {
        await createTransaction({
          itemData: { ...data },
        }).unwrap();
      }
      setEdit(null);
      reset();
      onClose();
      setError("");
    } catch (error) {
      if (hasErrorField(error)) {
        setError(error.data.error);
      }
    }
  };

  return (
    <div>
      <ErrorMessage error={error} />
      <form
        className="flex gap-4 flex-col"
        onSubmit={handleSubmit(onSubmit)}
        onReset={reset}
      >
        <FormInput
          control={control}
          name="name"
          label="Name"
          type="text"
          required="Name required"
        />
        <FormSelect
          control={control}
          items={[
            { key: "expense", label: "Расход" },
            { key: "income", label: "Доход" },
          ]}
          label="Type"
          name="type"
          required="Type required"
        />
        <FormInput
          control={control}
          name="amount"
          label="Amount"
          type="number"
          required="Amount required"
        />

        <FormAutocomplete
          control={control}
          name="category"
          label="Category"
          placeholder="Без категории"
        />

        <FormInput
          control={control}
          name="date"
          label="Date"
          type="date"
          required="Date required"
        />
        <div>
          {edit ? (
            <div className="flex gap-2">
              {/* <Button
                type="button"
                className="w-full"
                color="primary"
                onClick={() => {
                  reset();
                  setEdit(null);
                  onClose();
                }}
              >
                Cancel
              </Button> */}
              <Button type="submit" className="w-full" color="primary">
                Сохранить
              </Button>
            </div>
          ) : (
            <Button type="submit" className="w-full" color="primary">
              Добавить
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default FormTransaction;