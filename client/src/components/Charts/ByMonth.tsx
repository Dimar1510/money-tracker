import { AgCharts } from "ag-charts-react";
import { AgChartOptions } from "ag-charts-types";
import { _capitalise } from "ag-grid-community";
import { useCallback, useContext } from "react";
import { useGetAllTransactionsQuery } from "src/app/services/transactionApi";
import { format, setDefaultOptions } from "date-fns";
import { ru } from "date-fns/locale";
import { ThemeContext } from "../ThemeProvider";
import { Card } from "@nextui-org/react";
setDefaultOptions({ locale: ru });

interface ISeries {
  type: "bar";
  xKey: string;
  yKey: string;
  yName: string;
  stacked?: boolean;
  normalizedTo?: number;
}

interface IMonth {
  month: string;
  [key: string]: string | number;
}

const ByMonth = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { data: transactions } = useGetAllTransactionsQuery();

  const expenseChartData = useCallback(() => {
    const chartData: IMonth[] = [];
    transactions?.totalExpenseByMonth.forEach((item) => {
      const newMonth: IMonth = {
        month: item._id,
      };
      item.categories.forEach((category) => {
        newMonth[category.name] = category.total;
      });
      chartData.push(newMonth);
    });
    return chartData
      .sort((a, b) => (a.month > b.month ? 1 : -1))
      .map((item) => ({
        ...item,
        month: format(new Date(item.month), "MMM yyyy"),
      }));
  }, [transactions]);

  const seriesChart = useCallback(() => {
    const seriesData: ISeries[] = [];
    transactions?.totalExpenseByCategory.forEach((item) => {
      if (item.total > 0) {
        seriesData.push({
          type: "bar",
          xKey: "month",
          yKey: item.category,
          yName:
            item.category === "__other"
              ? "Без категории"
              : _capitalise(item.category),
          stacked: true,
          normalizedTo: 100,
        });
      }
    });
    return seriesData;
  }, [transactions]);

  const options: AgChartOptions = {
    title: {
      text: "Расходы по месяцам",
    },

    theme: theme === "dark" ? "ag-default-dark" : "ag-default",
    background: { visible: false },
    data: expenseChartData(),
    series: seriesChart(),
    axes: [
      {
        type: "category",
        position: "bottom",
      },
      {
        type: "number",
        label: {
          format: "#{f}%",
        },
      },
    ],
  };

  return (
    <Card className="h-[450px] overflow-x-auto">
      <AgCharts options={options} className="h-full min-w-fit" />
    </Card>
  );
};

export default ByMonth;
