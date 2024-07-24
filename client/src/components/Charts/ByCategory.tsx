import { useContext, useMemo } from "react";
import { AgCharts } from "ag-charts-react";
import { AgChartOptions } from "ag-charts-community";
import { useGetAllCategoriesQuery } from "src/app/services/categoryApi";
import { Button, Card, CardFooter, useDisclosure } from "@nextui-org/react";
import { ThemeContext } from "../ThemeProvider";
import { _capitalise } from "ag-grid-community";
import ToggleCardBody from "../ui/ToggleCardBody/ToggleCardBody";
import CategoryList from "../CategoryList/CategoryList";

const ByCategory = () => {
  const { data } = useGetAllCategoriesQuery();
  const { theme, toggleTheme } = useContext(ThemeContext);

  const expenseChartData = useMemo(() => {
    if (data) {
      const totalExpenseByCategory: { category: string; total: number }[] = [];
      data.forEach((category) => {
        if (
          category.transactions.length > 0 &&
          category.transactions.some((item) => item.type === "expense")
        )
          totalExpenseByCategory.push({
            total: category.transactions.reduce(
              (a, b) => (b.type === "expense" ? a + b.amount : a),
              0
            ),
            category:
              category.name === "__other"
                ? "Без категории"
                : _capitalise(category.name),
          });
      });
      return totalExpenseByCategory;
    }
  }, [data]);

  const incomeChartData = useMemo(() => {
    if (data) {
      const totalIncomeByCategory: { category: string; total: number }[] = [];
      data.forEach((category) => {
        if (
          category.transactions.length > 0 &&
          category.transactions.some((item) => item.type === "income")
        )
          totalIncomeByCategory.push({
            total: category.transactions.reduce(
              (a, b) => (b.type === "income" ? a + b.amount : a),
              0
            ),
            category:
              category.name === "__other"
                ? "Без категории"
                : _capitalise(category.name),
          });
      });
      return totalIncomeByCategory;
    }
  }, [data]);

  const optionsExpense: AgChartOptions = {
    data: expenseChartData,
    title: {
      text: "Расходы по категориям",
    },
    theme: theme === "dark" ? "ag-default-dark" : "ag-default",
    background: { visible: false },

    series: [
      {
        type: "donut",
        calloutLabelKey: "category",
        angleKey: "total",
        innerRadiusRatio: 0.7,
      },
    ],
  };

  const optionsIncome: AgChartOptions = {
    data: incomeChartData,
    title: {
      text: "Доходы по категориям",
    },
    theme: theme === "dark" ? "ag-default-dark" : "ag-default",
    background: { visible: false },

    series: [
      {
        type: "donut",
        calloutLabelKey: "category",
        angleKey: "total",
        innerRadiusRatio: 0.7,
      },
    ],
  };

  if (data && data.length < 2)
    return (
      <Card>
        <p>
          Здесь будут показаны расходы и доходы по вашим категориям. Для
          создания новой категории добавьте транзакцию с присвоением имени
          категории.
        </p>
      </Card>
    );
  if (data && data.length > 1)
    return (
      <>
        <Card>
          <ToggleCardBody cardKey="byCategory" cardTitle="По категориям">
            <div className="flex flex-col gap-4">
              <div className="flex justify-center gap-8">
                <div className="flex-1">
                  <AgCharts options={optionsExpense} />
                </div>
                <div className="flex-1">
                  <AgCharts options={optionsIncome} />
                </div>
              </div>
              <div className="self-end pb-4 pr-4">
                <CategoryList data={data} />
              </div>
            </div>
          </ToggleCardBody>
        </Card>
      </>
    );
};

export default ByCategory;
