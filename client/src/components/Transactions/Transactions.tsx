import { FunctionComponent, useCallback, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import {
  ColDef,
  ValueFormatterParams,
  RowValueChangedEvent,
} from "ag-grid-community";

import { useGetAllTransactionsQuery } from "src/app/services/transactionApi";
import { AG_GRID_LOCALE_RU } from "src/utils/locale.ru";
import type { CustomCellRendererProps } from "@ag-grid-community/react";
import { Button } from "@nextui-org/react";
import { MdDeleteOutline } from "react-icons/md";

const dateFormatter = (params: ValueFormatterParams): string => {
  return new Date(params.value).toLocaleDateString("ru-ru", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const ActionsCellRenderer: FunctionComponent<CustomCellRendererProps> = ({
  node,
}) => {
  const onRemoveClick = () => {
    console.log(node.data.id);
  };

  return (
    <button onClick={onRemoveClick}>
      <MdDeleteOutline />
    </button>
  );
};

const gridOptions = {
  localeText: AG_GRID_LOCALE_RU,
};

export const TransactionsList = () => {
  const { data } = useGetAllTransactionsQuery();
  const categories: string[] = [];
  data?.categories.forEach((item) => {
    categories.push(item.category);
  });
  console.log(categories);
  const columnDefs: ColDef[] = [
    {
      headerName: "Name",
      field: "name",
      minWidth: 50,
      flex: 1,
      filter: true,
      editable: true,
      valueSetter: (params) => {
        console.log(params.newValue);
        return true;
      },
    },
    {
      headerName: "Type",
      field: "type",
      minWidth: 50,
      flex: 1,
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: ["income", "expense"],
      },
      valueSetter: (params) => {
        console.log("changed Type");
        return true;
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
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: categories,
      },
      valueSetter: (params) => {
        console.log("changed Category");
        return true;
      },
    },
    {
      field: "",
      cellRenderer: ActionsCellRenderer,
      width: 50,
      resizable: false,
    },
  ];

  const onRowValueChanged = useCallback((event: RowValueChangedEvent) => {
    const data = event.data;
    console.log(data);
  }, []);

  return (
    <div className="w-full">
      <div className="ag-theme-quartz w-full h-full">
        <AgGridReact
          rowSelection="multiple"
          columnDefs={columnDefs}
          rowData={data?.transactions}
          gridOptions={gridOptions}
          onRowValueChanged={onRowValueChanged}
          editType={"fullRow"}
        />
      </div>
    </div>
  );
};

export default TransactionsList;
