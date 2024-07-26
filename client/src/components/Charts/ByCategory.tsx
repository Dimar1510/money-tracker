import { useContext, useMemo } from "react";
import { AgCharts } from "ag-charts-react";
import { AgChartOptions } from "ag-charts-community";
import {
  ICategory,
  useGetAllCategoriesQuery,
} from "src/app/services/categoryApi";
import { Card, CardHeader } from "@nextui-org/react";
import { ThemeContext } from "../ThemeProvider";
import { _capitalise } from "ag-grid-community";
import CategoryList from "../CategoryList/CategoryList";
import { GrPieChart } from "react-icons/gr";
import ToggleCard from "../ui/ToggleCardBody/ToggleCard";
import { useGetTotal } from "src/utils/getTotal";

const useChartData = (
  data: ICategory[] | undefined,
  type: "expense" | "income"
) => {
  return useMemo(() => {
    if (!data || data.length === 0) {
      return [];
    }
    return data
      .map((category) => {
        const total = category.transactions.reduce((sum, transaction) => {
          return transaction.type === type ? sum + transaction.amount : sum;
        }, 0);
        return {
          category:
            category.name === "__other"
              ? "Без категории"
              : _capitalise(category.name),
          total,
        };
      })
      .filter((category) => category.total > 0);
  }, [data, type]);
};

const getChartOptions = (
  data: { category: string; total: number }[],
  title: string,
  theme: string,
  amount: number
): AgChartOptions => ({
  data,
  theme: theme === "dark" ? "ag-default-dark" : "ag-default",
  background: { visible: false },
  legend: {
    enabled: false,
  },
  series: [
    {
      type: "donut",
      calloutLabelKey: "category",
      angleKey: "total",
      innerRadiusRatio: 0.6,
      tooltip: {
        renderer: (params) => {
          return {
            content: `₽ ${params.datum[params.angleKey].toLocaleString()}`,
          };
        },
      },
      innerLabels: [
        {
          text: title,
          fontWeight: "bold",
        },
        {
          text: `₽ ${amount.toLocaleString()}`,
          color: "#ffffff",
          spacing: 10,
          fontSize: 15,
        },
      ],
    },
  ],
});

const ByCategory = () => {
  const { data } = useGetAllCategoriesQuery();
  const { theme } = useContext(ThemeContext);
  const { expense, income } = useGetTotal();
  const expenseChartData = useChartData(data, "expense");
  const incomeChartData = useChartData(data, "income");

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader className="justify-between">
          <h3>По категориям</h3>
        </CardHeader>
        <p className="px-4 pb-4 text-sm text-default-400">
          Здесь будут показаны расходы и доходы по вашим категориям. Для
          создания новой категории добавьте транзакцию с присвоением имени
          категории.
        </p>
      </Card>
    );
  }

  return (
    <ToggleCard
      cardKey="byCategory"
      cardTitle="Категории транзакций"
      icon={<GrPieChart />}
    >
      <div className="flex flex-col gap-4">
        <div className="flex justify-center gap-8">
          <div className="flex-1">
            <AgCharts
              options={getChartOptions(
                expenseChartData,
                "Расходы",
                theme,
                expense
              )}
            />
          </div>
          <div className="flex-1">
            <AgCharts
              options={getChartOptions(
                incomeChartData,
                "Доходы",
                theme,
                income
              )}
            />
          </div>
        </div>
        <div className="self-end pb-4 pr-4">
          <CategoryList data={data} />
        </div>
      </div>
    </ToggleCard>
  );
};

export default ByCategory;
