import {
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
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
import { MdAdd, MdDeleteOutline, MdOutlineEdit } from "react-icons/md";
import { useForm } from "react-hook-form";
import { hasErrorField } from "src/utils/has-error-field";
import FormTransaction from "./FormTransaction";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import ErrorMessage from "../ui/error-message/ErrorMessage";
import { FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa";
import { ThemeContext } from "../ThemeProvider";

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
  const { theme, toggleTheme } = useContext(ThemeContext);
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
      setValue("type", node.data.type);
      setValue("category", node.data.category.name);
    };

    return (
      <div className="flex gap-4 items-center justify-center h-full">
        <button onClick={onEditClick} className="hover:text-primary">
          <MdOutlineEdit size={20} />
        </button>
        <button onClick={onRemoveClick} className="hover:text-danger-500">
          <MdDeleteOutline size={20} />
        </button>
      </div>
    );
  };

  const TypeCellRenderer: FunctionComponent<CustomCellRendererProps> = ({
    node,
  }) => {
    return node.data.type === "income" ? (
      <span className="flex items-center gap-1">
        <FaLongArrowAltUp className="text-success-600" />
        Доход
      </span>
    ) : (
      <span className="flex items-center gap-1">
        <FaLongArrowAltDown className="text-danger-800" />
        Расход
      </span>
    );
  };

  const columnDefs: ColDef[] = [
    {
      headerName: "Название",
      field: "name",
      minWidth: 150,
      flex: 1,
      filter: true,
      headerCheckboxSelection: true,
      checkboxSelection: true,
    },
    {
      headerName: "Тип",
      field: "type",
      minWidth: 100,
      flex: 1,
      cellRenderer: TypeCellRenderer,
    },
    {
      headerName: "Сумма",
      field: "amount",
      minWidth: 150,
      flex: 1,
      filter: "agNumberColumnFilter",
      valueFormatter: (params: ValueFormatterParams) => {
        return "₽ " + params.value.toLocaleString();
      },
    },
    {
      headerName: "Категория",
      field: "category",
      minWidth: 150,
      flex: 1,
      valueFormatter: (params: ValueFormatterParams) => {
        return params.value.name === "__other"
          ? "Без категории"
          : params.value.name;
      },
    },
    {
      headerName: "Дата",
      field: "date",
      minWidth: 150,
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

  const sortGrid = (event: GridReadyEvent, field: string, sortDir: "asc") => {
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
      sortGrid(event, "date", "asc");
    },
  };

  return (
    <div className="w-full flex flex-col gap-3 flex-1">
      <ErrorMessage error={error} />
      <div className="flex justify-between">
        <Button
          onPress={() => {
            onOpen();
            formReset();
            setEdit(null);
          }}
          startContent={<MdAdd />}
        >
          Добавить транзакцию
        </Button>
      </div>

      <div className="flex justify-between">
        <Input
          type="text"
          id="filter-text-box"
          placeholder="Быстрый поиск..."
          onInput={onFilterTextBoxChanged}
          className="w-[200px]"
        />
        {remove.length > 0 && (
          <Button onClick={handleDeleteMany} startContent={<MdDeleteOutline />}>
            Удалить: {remove.length}
          </Button>
        )}
      </div>

      <div
        className={`${
          theme === "dark" ? "ag-theme-alpine-dark" : "ag-theme-alpine"
        } w-full h-[400px]`}
      >
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
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        className={`${theme} text-foreground`}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {edit ? (
                  <div className="flex gap-1 items-center">
                    <MdOutlineEdit /> Редактировать транзакцию
                  </div>
                ) : (
                  <div className="flex gap-1 items-center">
                    <MdAdd />
                    Создать транзакцию
                  </div>
                )}
              </ModalHeader>
              <ModalBody>
                <FormTransaction
                  edit={edit}
                  error={error}
                  setEdit={setEdit}
                  setError={setError}
                  control={control}
                  handleSubmit={handleSubmit}
                  reset={reset}
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
