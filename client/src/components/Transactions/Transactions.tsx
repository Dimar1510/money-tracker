import { FunctionComponent, useCallback, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import {
  ColDef,
  ValueFormatterParams,
  SelectionChangedEvent,
} from "ag-grid-community";

import {
  useCreateTransactionMutation,
  useDeleteTransactionMutation,
  useGetAllTransactionsQuery,
  useUpdateTransactionMutation,
} from "src/app/services/transactionApi";
import { AG_GRID_LOCALE_RU } from "src/utils/locale.ru";
import type { CustomCellRendererProps } from "@ag-grid-community/react";
import { Button } from "@nextui-org/react";
import { MdDeleteOutline, MdOutlineEdit } from "react-icons/md";
import ErrorMessage from "../ui/error-message/ErrorMessage";
import { useForm } from "react-hook-form";
import FormInput from "../ui/FormInput/FormInput";
import { hasErrorField } from "src/utils/has-error-field";

const dateFormatter = (params: ValueFormatterParams): string => {
  return new Date(params.value).toLocaleDateString("ru-ru", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export interface ITransaction {
  name: string;
  date: string;
  amount: number;
  category: string;
  type: string;
}

export const TransactionsList = () => {
  const { data } = useGetAllTransactionsQuery();
  const [deleteTransaction] = useDeleteTransactionMutation();
  const [createTransaction] = useCreateTransactionMutation();
  const [updateTransaction] = useUpdateTransactionMutation();
  const [edit, setEdit] = useState<string | null>(null);
  const [remove, setRemove] = useState<string[]>([]);
  const categories: string[] = [];
  data?.categories.forEach((item) => {
    categories.push(item.category);
  });

  const [error, setError] = useState("");
  const { handleSubmit, control, setValue } = useForm<ITransaction>({
    mode: "onChange",
    reValidateMode: "onBlur",
  });

  const reset = () => {
    setValue("name", "");
    setValue("date", "");
    setValue("amount", 0);
    setValue("category", "");
    setValue("type", "");
  };

  const ActionsCellRenderer: FunctionComponent<CustomCellRendererProps> = ({
    node,
  }) => {
    const onRemoveClick = async () => {
      try {
        reset();
        setEdit(null);
        await deleteTransaction({ ids: [node.data.id] }).unwrap();
        setError("");
      } catch (error) {
        if (hasErrorField(error)) {
          setError(error.data.error);
        }
      }
    };
    const onEditClick = () => {
      setEdit(node.data.id);
      setValue("name", node.data.name);
      setValue("date", node.data.date);
      setValue("amount", node.data.amount);
      setValue("category", node.data.category);
      setValue("type", node.data.type);
    };

    return (
      <div className="flex gap-2 items-center justify-center h-full">
        <button onClick={onEditClick}>
          <MdOutlineEdit />
        </button>
        <button onClick={onRemoveClick}>
          <MdDeleteOutline />
        </button>
      </div>
    );
  };

  const gridOptions = {
    localeText: AG_GRID_LOCALE_RU,
  };
  const columnDefs: ColDef[] = [
    {
      headerName: "Name",
      field: "name",
      minWidth: 50,
      flex: 1,
      filter: true,
      headerCheckboxSelection: true,
      checkboxSelection: true,
    },
    {
      headerName: "Type",
      field: "type",
      minWidth: 50,
      flex: 1,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: ["income", "expense"],
      },
    },
    {
      headerName: "Date",
      field: "date",
      minWidth: 50,
      flex: 1,
      filter: "agDateColumnFilter",
      valueFormatter: dateFormatter,
    },
    {
      headerName: "Amount",
      field: "amount",
      minWidth: 50,
      flex: 1,
      filter: "agNumberColumnFilter",
      valueFormatter: (params: ValueFormatterParams) => {
        return "₽ " + params.value.toLocaleString();
      },
    },
    {
      headerName: "Category",
      field: "category",
      minWidth: 50,
      flex: 1,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: categories,
      },
    },
    {
      field: "",
      cellRenderer: ActionsCellRenderer,
      width: 50,
      resizable: false,
    },
  ];

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

  const onSelectionChanged = (event: SelectionChangedEvent) => {
    const rowCount = event.api.getSelectedNodes();
    const ids: Set<string> = new Set();
    rowCount.forEach((node) => {
      ids.add(node.data.id);
    });
    setRemove([...ids]);
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
    <div className="w-full">
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
        <FormInput
          control={control}
          name="category"
          label="Category"
          type="text"
          required="Category required"
        />
        <FormInput
          control={control}
          name="type"
          label="Type"
          type="text"
          required="Type required"
        />

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
      <div className="ag-theme-quartz w-full h-full">
        <AgGridReact
          rowSelection="multiple"
          columnDefs={columnDefs}
          rowData={data?.transactions}
          gridOptions={gridOptions}
          suppressRowClickSelection={true}
          onSelectionChanged={onSelectionChanged}
        />
      </div>
    </div>
  );
};

export default TransactionsList;
