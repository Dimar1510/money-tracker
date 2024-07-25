import { useGetAllTransactionsQuery } from "src/app/services/transactionApi";
import { useContext, useMemo } from "react";
import { AgCharts } from "ag-charts-react";
import { AgChartOptions } from "ag-charts-community";
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

  const expenseChartData = useMemo(() => {
    if (!transactions || !transactions.totalExpenseByYear) {
      return [];
    }

    const chartData = transactions.totalExpenseByYear.map((year) => {
      const newYear: IYear = {
        year: year._id,
        months: [],
      };

      year.months.forEach((monthItem) => {
        const monthItemDate = format(new Date(monthItem.month), "LLL");
        newYear.months.push({ month: monthItemDate, total: monthItem.total });
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
      <ToggleCardBody cardKey="byYear" cardTitle="Расходы по времени">
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
                      type: "line",
                      xKey: "month",
                      yKey: "total",
                      yName: "Expenses",
                    },
                  ],
                  theme: theme === "dark" ? "ag-default-dark" : "ag-default",
                  background: { visible: false },
                }}
                className="h-[450px]"
              />
            ))}
          </Slider>
        </div>
      </ToggleCardBody>
    </Card>
  );
};

export default BalanceChart;
