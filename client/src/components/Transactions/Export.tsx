import { Button } from "@nextui-org/react";
import { _capitalise } from "ag-grid-community";
import { format } from "date-fns";
import xlsx from "json-as-xlsx";
import { Transaction } from "src/app/types";
import { PiMicrosoftExcelLogo } from "react-icons/pi";
const Export = ({ data }: { data: Transaction[] }) => {
  const exportToExcel = () => {
    const content = data.map((item) => {
      return {
        name: item.name,
        type: item.type === "income" ? "Доход" : "Расход",
        amount: item.amount,
        category:
          item.category.name === "__other"
            ? "Без категории"
            : _capitalise(item.category.name),
        date: format(item.date, "dd-MM-yyyy"),
      };
    });
    const columns = [
      { label: "Название", value: "name" },
      { label: "Тип", value: "type" },
      { label: "Сумма", value: "amount" },
      { label: "Категория", value: "category" },
      { label: "Дата", value: "date" },
    ];
    const excelData = [
      {
        sheet: "Транзакции",
        columns,
        content,
      },
    ];
    const settings = {
      fileName: "Мои транзакции",
    };
    xlsx(excelData, settings);
  };

  return (
    <Button
      color="primary"
      variant="faded"
      className="flex gap-2 items-center"
      onClick={exportToExcel}
    >
      <PiMicrosoftExcelLogo size={20} />
      Сохранить таблицу
    </Button>
  );
};

export default Export;
