import { FC } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import {
  useCreateTransactionMutation,
  useUpdateTransactionMutation,
} from "src/app/services/transactionApi";
import { Button } from "@nextui-org/react";
import ErrorMessage from "../ui/error-message/ErrorMessage";
import { Control, UseFormHandleSubmit } from "react-hook-form";
import FormInput from "../ui/FormInput/FormInput";
import { hasErrorField } from "src/utils/has-error-field";
import { ITransactionFormItem } from "./Transactions";
import FormSelect from "../ui/FormSelect/FormSelect";
import FormAutocomplete from "../ui/FormAutocomplete/FormAutocomplete";
import normalizeString from "src/utils/normalizeString";

interface IProps {
  error: string;
  setError: (err: string) => void;
  edit?: string | null;
  setEdit?: (id: string | null) => void;
  reset: () => void;
  handleSubmit: UseFormHandleSubmit<ITransactionFormItem, undefined>;
  control: Control<ITransactionFormItem, any>;
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
  const [createTransaction, createResult] = useCreateTransactionMutation();
  const [updateTransaction, updateResult] = useUpdateTransactionMutation();

  const onSubmit = async (data: ITransactionFormItem) => {
    try {
      if (edit) {
        await updateTransaction({
          itemData: {
            ...data,
            name: normalizeString(data.name),
            category: normalizeString(data.category),
          },
          id: edit,
        }).unwrap();
      } else {
        await createTransaction({
          itemData: {
            ...data,
            name: normalizeString(data.name),
            category: normalizeString(data.category),
          },
        }).unwrap();
      }
      setEdit && setEdit(null);
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
          label="Название"
          type="text"
          required="Введите название"
        />
        <FormSelect
          control={control}
          items={[
            { key: "expense", label: "Расход" },
            { key: "income", label: "Доход" },
          ]}
          label="Тип"
          name="type"
          required="Указать тип"
        />
        <FormInput
          control={control}
          name="amount"
          label="Сумма"
          type="number"
          required="Указать сумму"
        />

        <FormAutocomplete
          control={control}
          name="category"
          label="Категория"
          placeholder="Оставить без категории"
        />

        <FormInput
          control={control}
          name="date"
          label="Дата"
          type="date"
          required="Указать дату"
        />
        <div>
          {edit ? (
            <div className="flex gap-2">
              <Button
                isLoading={updateResult.isLoading || createResult.isLoading}
                type="submit"
                className="w-full text-default-100 font-medium"
                color="primary"
              >
                Сохранить
              </Button>
            </div>
          ) : (
            <Button
              isLoading={updateResult.isLoading || createResult.isLoading}
              type="submit"
              className="w-full text-default-100 font-medium"
              color="primary"
            >
              Добавить
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default FormTransaction;
