import { useGetAllTransactionsQuery } from "src/app/services/transactionApi";
import { useContext, useMemo } from "react";
import { AgCharts } from "ag-charts-react";
import { AgChartOptions, AgCartesianAxisOptions } from "ag-charts-community";
import { ThemeContext } from "../ThemeProvider";
import { Card, CardHeader } from "@nextui-org/react";
import ToggleCardBody from "../ui/ToggleCardBody/ToggleCardBody";
import { _capitalise } from "ag-grid-community";
import { format, setDefaultOptions } from "date-fns";
import { ru } from "date-fns/locale";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
setDefaultOptions({ locale: ru });
import { settings } from "./SliderSettings";
import HelpTooltip from "../ui/HelpTooltip/HelpTooltip";

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
  let currentBalance = 0;
  const expenseChartData = useMemo(() => {
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

  if (transactions && expenseChartData.length < 1)
    return (
      <Card>
        <CardHeader className="justify-between">
          <h3>График расходов</h3>
        </CardHeader>
        <p className="px-4 pb-4 text-sm text-default-400">
          Создайте новую транзакцию типа "расход", чтобы начать отслеживать
          баланс.
        </p>
      </Card>
    );

  return (
    <Card className="">
      <ToggleCardBody cardKey="balance" cardTitle="Общий график">
        <div className="slider-container px-14 pb-10">
          <Slider
            {...{ ...settings, initialSlide: expenseChartData.length - 1 }}
          >
            {expenseChartData.map((year) => (
              <AgCharts
                key={year.year}
                options={{
                  title: { text: `${year.year}г.` },

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
                      },
                    },
                    {
                      type: "number",
                      position: "right",
                      keys: ["balance"],
                      title: {
                        text: "Баланс",
                      },
                    },
                  ] as AgCartesianAxisOptions[],
                  theme: theme === "dark" ? "ag-default-dark" : "ag-default",
                  background: { visible: false },
                }}
                className="h-[450px]"
              />
            ))}
          </Slider>
          <div className="flex justify-end pb-4 pr-4">
            <HelpTooltip
              text="Нажмите на тип, чтобы скрыть его"
              placement="left"
            />
          </div>
        </div>
      </ToggleCardBody>
    </Card>
  );
};

export default BalanceChart;