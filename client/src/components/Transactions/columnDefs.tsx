import { FC } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ValueFormatterParams, _capitalise } from "ag-grid-community";
import type { CustomCellRendererProps } from "@ag-grid-community/react";
import { IoSettingsOutline } from "react-icons/io5";

const dateFormatter = (params: ValueFormatterParams): string => {
  return new Date(params.value).toLocaleDateString("ru-ru", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const CustomHeader = () => {
  return (
    <div className="flex items-center justify-center mx-auto">
      <span className="custom-header-icon">
        <IoSettingsOutline size={20} />
      </span>
    </div>
  );
};

export const columnDefs = ({
  TypeCellRenderer,
  ActionsCellRenderer,
}: {
  TypeCellRenderer: FC<CustomCellRendererProps>;
  ActionsCellRenderer: FC<CustomCellRendererProps>;
}) => {
  return [
    {
      field: "",
      headerName: "",
      cellRenderer: ActionsCellRenderer,
      width: 80,
      resizable: false,
      headerComponent: CustomHeader,
    },
    {
      headerName: "Название",
      field: "name",
      minWidth: 120,
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
      minWidth: 100,
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
          : _capitalise(params.value.name);
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
  ];
};
