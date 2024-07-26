import { useGetAllTransactionsQuery } from "src/app/services/transactionApi";
import { useContext, useEffect, useMemo, useState } from "react";
import { AgCharts } from "ag-charts-react";
import { AgCartesianAxisOptions } from "ag-charts-community";
import { ThemeContext } from "../ThemeProvider";
import { Card, CardHeader } from "@nextui-org/react";
import ToggleCardBody from "../ui/ToggleCardBody/ToggleCard";
import { _capitalise } from "ag-grid-community";
import { format, setDefaultOptions } from "date-fns";
import { ru } from "date-fns/locale";
setDefaultOptions({ locale: ru });
import HelpTooltip from "../ui/HelpTooltip/HelpTooltip";
import ChartNavigation from "./ChartNavigation";
import { GoGraph } from "react-icons/go";
import ToggleCard from "../ui/ToggleCardBody/ToggleCard";
interface IMonth {
  month: string;
  [key: string]: string | number;
}

interface IYear {
  year: string;
  months: IMonth[];
}

const BalanceChart = () => {
  const { data: transactions } = useGetAllTransactionsQuery();
  const { theme } = useContext(ThemeContext);
  const [slide, setSlide] = useState(0);
  let currentBalance = 0;

  const balanceChartData = useMemo(() => {
    if (!transactions || !transactions.byYearData) {
      return [];
    }

    const chartData = transactions.byYearData.map((yearItem) => {
      const newYear: IYear = {
        year: yearItem.year,
        months: [],
      };

      yearItem.months.forEach((monthItem) => {
        const monthItemDate = format(new Date(monthItem.month), "LLL");
        currentBalance = currentBalance + monthItem.income - monthItem.expense;
        newYear.months.push({
          month: monthItemDate,
          expense: monthItem.expense,
          income: monthItem.income,
          balance: currentBalance,
        });
      });

      return newYear;
    });

    return chartData;
  }, [transactions]);

  useEffect(() => {
    if (balanceChartData.length > 0) {
      setSlide(balanceChartData.length - 1);
    }
  }, [balanceChartData]);

  if (transactions && balanceChartData.length < 1)
    return (
      <Card className="flex-1">
        <CardHeader className="justify-between">
          <h3>График расходов</h3>
        </CardHeader>
        <p className="px-4 pb-4 text-sm text-default-400">
          Создайте новую транзакцию, чтобы начать отслеживать баланс.
        </p>
      </Card>
    );
  const year = balanceChartData[slide];
  if (year)
    return (
      <ToggleCard cardKey="balance" cardTitle="Общий график" icon={<GoGraph />}>
        <div className="slider-container">
          <AgCharts
            options={{
              subtitle: {
                text: `Сравнение расходов и общего баланса за ${year.year}г.`,
              },
              data: year.months,
              series: [
                {
                  type: "bar",
                  xKey: "month",
                  yKey: "expense",
                  yName: "Расходы",
                },
                {
                  type: "line",
                  xKey: "month",
                  yKey: "balance",
                  yName: "Баланс",
                },
              ],
              axes: [
                {
                  type: "category",
                  position: "bottom",
                },
                {
                  type: "number",
                  position: "left",
                  keys: ["expense"],
                  title: {
                    text: "Расходы в месяц",
                    color: "#63b1ff",
                    enabled: !window.matchMedia("(max-width: 600px)").matches,
                  },
                  label: {
                    fontSize: 10,
                    formatter: (params) => {
                      return "₽ " + params.value.toLocaleString();
                    },
                  },
                },
                {
                  type: "number",
                  position: "right",
                  keys: ["balance"],
                  title: {
                    text: "Баланс",
                    color: "orange",
                    enabled: !window.matchMedia("(max-width: 600px)").matches,
                  },
                  label: {
                    fontSize: 10,
                    formatter: (params) => {
                      return "₽ " + params.value.toLocaleString();
                    },
                  },
                },
              ] as AgCartesianAxisOptions[],
              theme: theme === "dark" ? "ag-default-dark" : "ag-default",
              background: { visible: false },
            }}
            className="h-[450px]"
          />
          <div className="flex justify-between pb-4 px-4">
            <ChartNavigation
              lastSlide={balanceChartData.length - 1}
              setSlide={setSlide}
              slide={slide}
              year={year.year}
            />

            <HelpTooltip
              text="Нажмите на тип, чтобы скрыть его"
              placement="left"
            />
          </div>
        </div>
      </ToggleCard>
    );
};

export default BalanceChart;
