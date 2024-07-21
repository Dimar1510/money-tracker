import { useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import {
  GridReadyEvent,
  GridApi,
  ColDef,
  ValueFormatterParams,
} from "ag-grid-community";
import { useGetAllTransactionsQuery } from "src/app/services/transactionApi";
import { AG_GRID_LOCALE_RU } from "src/utils/locale.ru";

const dateFormatter = (params: ValueFormatterParams): string => {
  return new Date(params.value).toLocaleDateString("ru-ru", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const columnDefs: ColDef[] = [
  {
    headerName: "Name",
    field: "name",
    minWidth: 50,
    flex: 1,
    filter: true,
  },
  {
    headerName: "Type",
    field: "type",
    minWidth: 50,
    flex: 1,
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
  },
];

type AgGridApi = {
  grid?: GridApi;
  column?: GridApi;
};

const gridOptions = {
  localeText: AG_GRID_LOCALE_RU,
};

export const TransactionsList = () => {
  const { data } = useGetAllTransactionsQuery();
  const apiRef = useRef<AgGridApi>({
    grid: undefined,
    column: undefined,
  });
  const onGridReady = (params: GridReadyEvent) => {
    apiRef.current.grid = params.api;
    apiRef.current.column = params.api;
  };

  return (
    <div className="w-full">
      <div
        style={{ height: "100%", width: "100%" }}
        className="ag-theme-quartz "
      >
        <AgGridReact
          rowSelection="multiple"
          suppressRowClickSelection
          columnDefs={columnDefs}
          onGridReady={onGridReady}
          rowData={data?.transactions}
          gridOptions={gridOptions}
        />
      </div>
    </div>
  );
};

export default TransactionsList;
