import {
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import {
  ColDef,
  ValueFormatterParams,
  SelectionChangedEvent,
} from "ag-grid-community";
import {
  useDeleteTransactionMutation,
  useGetAllTransactionsQuery,
} from "src/app/services/transactionApi";
import { AG_GRID_LOCALE_RU } from "src/utils/locale.ru";
import type { CustomCellRendererProps } from "@ag-grid-community/react";
import { MdDeleteOutline, MdOutlineEdit } from "react-icons/md";
import { useForm } from "react-hook-form";
import { hasErrorField } from "src/utils/has-error-field";
import FormTransaction from "./FormTransaction";

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
  const [edit, setEdit] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [remove, setRemove] = useState<string[]>([]);
  const gridRef = useRef<AgGridReact>(null);

  // load categories

  const getCategories = data ? data.categories : [];
  const categories: { key: string; label: string }[] = [
    { key: "__other", label: "Другое" },
  ];
  getCategories.forEach((item) => {
    if (item.category !== "__other")
      categories.push({ key: item.category, label: item.category });
  });

  const { handleSubmit, control, setValue } = useForm<ITransaction>({
    mode: "onChange",
    reValidateMode: "onBlur",
    defaultValues: {
      type: "expense",
      category: "__other",
    },
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
      valueFormatter: (params: ValueFormatterParams) => {
        return params.value === "income" ? "доход" : "расход";
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
      valueFormatter: (params: ValueFormatterParams) => {
        return params.value === "__other" ? "Другое" : params.value;
      },
    },
    {
      field: "",
      cellRenderer: ActionsCellRenderer,
      width: 50,
      resizable: false,
    },
  ];

  const onSelectionChanged = (event: SelectionChangedEvent) => {
    const rowCount = event.api.getSelectedNodes();
    const ids: Set<string> = new Set();
    rowCount.forEach((node) => {
      ids.add(node.data.id);
    });
    setRemove([...ids]);
  };

  const onFilterTextBoxChanged = useCallback(() => {
    gridRef.current!.api.setGridOption(
      "quickFilterText",
      (document.getElementById("filter-text-box") as HTMLInputElement).value
    );
  }, []);

  return (
    <div className="w-full">
      <FormTransaction
        remove={remove}
        edit={edit}
        error={error}
        setEdit={setEdit}
        setError={setError}
        control={control}
        handleSubmit={handleSubmit}
        reset={reset}
        categories={categories}
      />
      <div className="example-header">
        <span>Quick Filter:</span>
        <input
          type="text"
          id="filter-text-box"
          placeholder="Filter..."
          onInput={onFilterTextBoxChanged}
        />
      </div>
      <div className="ag-theme-quartz w-full h-full">
        <AgGridReact
          ref={gridRef}
          rowSelection="multiple"
          columnDefs={columnDefs}
          rowData={data?.transactions}
          gridOptions={{ localeText: AG_GRID_LOCALE_RU }}
          suppressRowClickSelection={true}
          onSelectionChanged={onSelectionChanged}
        />
      </div>
    </div>
  );
};

export default TransactionsList;
