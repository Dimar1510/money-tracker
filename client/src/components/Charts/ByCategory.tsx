import { useCallback, useContext } from "react";
import { AgCharts } from "ag-charts-react";
import { AgChartOptions } from "ag-charts-community";
import { useGetAllCategoriesQuery } from "src/app/services/categoryApi";
import { Card } from "@nextui-org/react";
import { ThemeContext } from "../ThemeProvider";
import { _capitalise } from "ag-grid-community";

const ByCategory = () => {
  const { data } = useGetAllCategoriesQuery();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const expenseChartData = useCallback(() => {
    const totalExpenseByCategory: { category: string; total: number }[] = [];
    data?.forEach((category) => {
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
  }, [data]);

  const incomeChartData = useCallback(() => {
    const totalIncomeByCategory: { category: string; total: number }[] = [];
    data?.forEach((category) => {
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
  }, [data]);

  const optionsExpense: AgChartOptions = {
    data: expenseChartData(),
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
    data: incomeChartData(),
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

  if (data)
    return (
      <div className="flex justify-center gap-8">
        <Card className="flex-1">
          <AgCharts options={optionsExpense} />
        </Card>
        <Card className="flex-1">
          <AgCharts options={optionsIncome} />
        </Card>
      </div>
    );
};

export default ByCategory;
