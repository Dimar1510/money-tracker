import { AgCharts } from "ag-charts-react";
import { AgChartOptions } from "ag-charts-types";
import { _capitalise } from "ag-grid-community";
import { useCallback, useContext } from "react";
import { useGetAllTransactionsQuery } from "src/app/services/transactionApi";
import { format, setDefaultOptions } from "date-fns";
import { ru } from "date-fns/locale";
import { ThemeContext } from "../ThemeProvider";
import { Card } from "@nextui-org/react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
setDefaultOptions({ locale: ru });
import { settings } from "./SliderSettings";

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

interface IYear {
  year: string;
  months: IMonth[];
  series: ISeries[];
}

const ByMonth = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { data: transactions } = useGetAllTransactionsQuery();

  const expenseChartData = useCallback(() => {
    const chartData: IYear[] = [];
    transactions?.totalExpenseByYear.forEach((year) => {
      const newYear: IYear = {
        year: year._id,
        months: [],
        series: [],
      };
      year.months.forEach((month) => {
        const existMonth = newYear.months.find(
          (item) => item.month === month.month
        );
        if (existMonth) {
          existMonth[month.categories.name] = month.categories.total;
        } else {
          const newMonth: IMonth = {
            month: month.month,
          };

          newMonth[month.categories.name] = month.categories.total;

          newYear.months.push(newMonth);
        }

        const existCategory = newYear.series.find(
          (item) => item.yKey === month.categories.name
        );
        if (!existCategory) {
          newYear.series.push({
            type: "bar",
            xKey: "month",
            yKey: month.categories.name,
            yName:
              month.categories.name === "__other"
                ? "Без категории"
                : _capitalise(month.categories.name),
            stacked: true,
            normalizedTo: 100,
          });
        }
      });
      chartData.push({
        ...newYear,
        months: newYear.months.sort((a, b) => (a.month > b.month ? 1 : -1)),
      });
    });
    return chartData.sort((a, b) => (a.year > b.year ? 1 : -1));
  }, [transactions]);

  return (
    <Card className="px-14 pb-10">
      <div className="slider-container">
        <Slider
          {...{ ...settings, initialSlide: expenseChartData().length - 1 }}
        >
          {expenseChartData().map((year) => (
            <AgCharts
              key={year.year}
              options={{
                title: { text: `${year.year}г.` },
                subtitle: { text: "Расходы по месяцам " },
                data: year.months,
                series: year.series,
                theme: theme === "dark" ? "ag-default-dark" : "ag-default",
                background: { visible: false },
              }}
              className="h-[450px]"
            />
          ))}
        </Slider>
      </div>
    </Card>
  );
};

export default ByMonth;
