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
import FormSelect from "../ui/FormInput/FormSelect";

interface IProps {
  remove: string[];
  error: string;
  setError: (err: string) => void;
  edit: string | null;
  setEdit: (id: string | null) => void;
  reset: () => void;
  handleSubmit: UseFormHandleSubmit<ITransaction, undefined>;
  control: Control<ITransaction, any>;
  categories: {
    key: string;
    label: string;
  }[];
}

const FormTransaction: FC<IProps> = ({
  remove,
  error,
  setError,
  edit,
  setEdit,
  reset,
  handleSubmit,
  control,
  categories,
}) => {
  const [deleteTransaction] = useDeleteTransactionMutation();
  const [createTransaction] = useCreateTransactionMutation();
  const [updateTransaction] = useUpdateTransactionMutation();

  const onSubmit = async (data: ITransaction) => {
    try {
      if (edit) {
        await updateTransaction({ itemData: data, id: edit }).unwrap();
      } else {
        await createTransaction({ itemData: data }).unwrap();
      }
      setEdit(null);
      reset();
      setError("");
    } catch (error) {
      if (hasErrorField(error)) {
        setError(error.data.error);
      }
    }
  };

  const handleDeleteMany = async () => {
    try {
      reset();
      setEdit(null);
      await deleteTransaction({ ids: remove }).unwrap();
      setError("");
    } catch (error) {
      if (hasErrorField(error)) {
        setError(error.data.error);
      }
    }
  };

  return (
    <div>
      {edit ? "Edit " : "Create new "} transaction
      <ErrorMessage error={error} />
      {remove.length > 0 && (
        <Button onClick={handleDeleteMany}>Delete {remove.length} items</Button>
      )}
      <form
        className="flex gap-2"
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

        <FormSelect
          control={control}
          items={categories}
          label="Category"
          name="category"
          required="Category required"
        />
        {/* 
        <FormInput
          control={control}
          name="category"
          label="Category"
          type="text"
          required="Category required"
        /> */}
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
        {/* 
        <FormInput
          control={control}
          name="type"
          label="Type"
          type="text"
          required="Type required"
        /> */}

        <div>
          {edit ? (
            <div className="flex gap-2">
              <Button
                type="button"
                className="w-full"
                color="primary"
                onClick={() => {
                  reset();
                  setEdit(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" className="w-full" color="primary">
                Save
              </Button>
            </div>
          ) : (
            <Button type="submit" className="w-full" color="primary">
              Add
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default FormTransaction;
