import { AgCharts } from "ag-charts-react";
import { _capitalise } from "ag-grid-community";
import { useContext, useEffect, useMemo, useState } from "react";
import { useGetAllTransactionsQuery } from "src/app/services/transactionApi";
import { setDefaultOptions } from "date-fns";
import { ru } from "date-fns/locale";
import { ThemeContext } from "../ThemeProvider";
import { Card, CardHeader } from "@nextui-org/react";
setDefaultOptions({ locale: ru });
import { AgCartesianAxisOptions } from "ag-charts-community";
import { format } from "date-fns";
import HelpTooltip from "../ui/HelpTooltip/HelpTooltip";
import ChartNavigation from "./ChartNavigation";
import { MdOutlineStackedBarChart } from "react-icons/md";
import ToggleCard from "../ui/ToggleCardBody/ToggleCard";
import { AgBarSeriesTooltipRendererParams } from "ag-charts-community";

interface ISeries {
  type: "bar";
  xKey: string;
  yKey: string;
  yName: string;
  stacked?: boolean;
  normalizedTo?: number;
  tooltip: any;
}

interface IMonth {
  month: string;
  [key: string]: string | number;
}

interface IYear {
  year: string;
  months: IMonth[];
  series: ISeries[];
}

const ByMonth = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { data: transactions } = useGetAllTransactionsQuery();
  const [slide, setSlide] = useState(0);

  const expenseChartData = useMemo(() => {
    if (!transactions || !transactions.byYearData) {
      return [];
    }

    const chartData = transactions.byYearData.map((yearItem) => {
      const newYear: IYear = {
        year: yearItem.year,
        months: [],
        series: [],
      };

      const seriesMap = new Map<string, boolean>();

      yearItem.months.forEach((monthItem) => {
        const monthItemDate = format(new Date(monthItem.month), "LLL");
        const newMonth: IMonth = { month: monthItemDate };

        monthItem.expenseCategories.forEach((category) => {
          if (newMonth[category.name]) {
            newMonth[category.name] =
              (newMonth[category.name] as number) + category.expense;
          } else {
            newMonth[category.name] = category.expense;
          }

          if (!seriesMap.has(category.name)) {
            newYear.series.push({
              type: "bar",
              xKey: "month",
              yKey: category.name,
              yName:
                category.name === "__other"
                  ? "Без категории"
                  : _capitalise(category.name),
              stacked: true,
              normalizedTo: 100,
              tooltip: {
                renderer: (params: AgBarSeriesTooltipRendererParams<any>) => {
                  return {
                    content: `₽ ${params.datum[params.yKey].toLocaleString()}`,
                  };
                },
              },
            });
            seriesMap.set(category.name, true);
          }
        });

        newYear.months.push(newMonth);
      });

      return newYear;
    });

    return chartData;
  }, [transactions]);

  useEffect(() => {
    if (expenseChartData.length > 0) {
      setSlide(expenseChartData.length - 1);
    }
  }, [expenseChartData]);

  if (expenseChartData && expenseChartData.length < 1)
    return (
      <Card>
        <CardHeader className="justify-between">
          <h3>Расходы по времени</h3>
        </CardHeader>
        <p className="px-4 pb-4 text-sm text-default-400">
          Создайте новую транзакцию, и она появится в этом разделе.
        </p>
      </Card>
    );
  const year = expenseChartData[slide];
  if (year)
    return (
      <ToggleCard
        cardKey="byYear"
        cardTitle="Расходы"
        icon={<MdOutlineStackedBarChart />}
      >
        <div className="slider-container">
          <AgCharts
            options={{
              subtitle: {
                text: `Нормализация расходов по месяцам за ${year.year}г.`,
              },
              data: year.months,
              series: year.series,
              theme: theme === "dark" ? "ag-default-dark" : "ag-default",
              background: { visible: false },
              axes: [
                {
                  type: "category",
                  position: "bottom",
                },
                {
                  type: "number",

                  position: "left",
                  label: {
                    formatter: (params) => {
                      return params.value + "%";
                    },
                  },
                },
              ] as AgCartesianAxisOptions[],
            }}
            className="h-[450px]"
          />
          <div className="flex justify-between pb-4 px-4">
            <ChartNavigation
              lastSlide={expenseChartData.length - 1}
              setSlide={setSlide}
              slide={slide}
              year={year.year}
            />
            <HelpTooltip
              text="Нажмите на категорию, чтобы скрыть ее"
              placement="left"
            />
          </div>
        </div>
      </ToggleCard>
    );
};

export default ByMonth;
