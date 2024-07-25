import { AgCharts } from "ag-charts-react";
import { _capitalise } from "ag-grid-community";
import { useContext, useMemo } from "react";
import { useGetAllTransactionsQuery } from "src/app/services/transactionApi";
import { setDefaultOptions } from "date-fns";
import { ru } from "date-fns/locale";
import { ThemeContext } from "../ThemeProvider";
import { Card, CardHeader } from "@nextui-org/react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
setDefaultOptions({ locale: ru });
import { settings } from "./SliderSettings";
import ToggleCardBody from "../ui/ToggleCardBody/ToggleCardBody";
import { format } from "date-fns";

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
          newMonth[category.name] = category.expense;

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

  if (expenseChartData && expenseChartData.length > 0)
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
                    subtitle: { text: "Нормализация расходов по месяцам" },
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
        </ToggleCardBody>
      </Card>
    );
};

export default ByMonth;
