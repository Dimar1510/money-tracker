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
  GridReadyEvent,
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
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import ErrorMessage from "../ui/error-message/ErrorMessage";

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
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // load categories

  const getCategories = data ? data.totalExpenseByCategory : [];
  const categories: { key: string; label: string }[] = [
    { key: "__other", label: "Другое" },
  ];
  getCategories.forEach((item) => {
    if (item.category !== "__other")
      categories.push({ key: item.category, label: item.category });
  });

  const {
    handleSubmit,
    control,
    setValue,
    reset: formReset,
  } = useForm<ITransaction>({
    mode: "onChange",
    reValidateMode: "onBlur",
    defaultValues: {
      type: "expense",
      category: "__other",
    },
  });

  const reset = () => {
    formReset();
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
      onOpen();
      setValue("name", node.data.name);
      setValue("date", node.data.date);
      setValue("amount", node.data.amount);
      setValue("category", node.data.category.name);
      setValue("type", node.data.type);
    };

    return (
      <div className="flex gap-4 items-center justify-center h-full">
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
        return params.value.name === "__other" ? "Другое" : params.value.name;
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
      field: "",
      cellRenderer: ActionsCellRenderer,
      width: 80,
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

  const sortGrid = (event: GridReadyEvent, field: string, sortDir: "desc") => {
    const columnState = {
      state: [
        {
          colId: field,
          sort: sortDir,
        },
      ],
    };
    event.api.applyColumnState(columnState);
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

  const gridOptions = {
    defaultColDef: {
      sortable: true,
    },
    localeText: AG_GRID_LOCALE_RU,
    columnDefs,
    onGridReady: function (event: GridReadyEvent) {
      console.log("The grid is now ready", event);
      sortGrid(event, "date", "desc");
    },
  };

  return (
    <div className="w-full">
      <ErrorMessage error={error} />
      <Button
        onPress={() => {
          onOpen();
          formReset();
          setEdit(null);
        }}
      >
        Добавить транзакцию
      </Button>
      {remove.length > 0 && (
        <Button onClick={handleDeleteMany}>Delete {remove.length} items</Button>
      )}

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
          gridOptions={gridOptions}
          suppressRowClickSelection={true}
          onSelectionChanged={onSelectionChanged}
        />
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {edit ? "Редактировать " : "Создать "} транзакцию
              </ModalHeader>
              <ModalBody>
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
                  onClose={onClose}
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default TransactionsList;
