import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { selectGrid } from "src/app/gridSlice";
import { useAppSelector } from "src/app/hooks";
import { selectCurrent, selectIsAuthenticated } from "src/app/userSlice";
import BalanceChart from "src/components/Charts/BalanceChart";

import InfoCards from "src/components/InfoCards/InfoCards";
import TransactionsList from "src/components/Transactions/Transactions";
import CategoryChart from "src/components/Charts/CategoryChart";
import MonthChart from "src/components/Charts/MonthChart";
import { Toaster } from "react-hot-toast";
import { ThemeContext } from "src/components/ThemeProvider";

const Dashboard = () => {
  const isAuth = useAppSelector(selectIsAuthenticated);
  const current = useAppSelector(selectCurrent);
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuth) {
      navigate("/");
    }
  }, [isAuth, navigate]);
  const grid = useAppSelector(selectGrid);
  const { theme } = useContext(ThemeContext);

  if (current)
    return (
      <>
        <div className="flex gap-2 sm:gap-8 flex-col p-2 sm:p-8 flex-1 max-w-[1400px] w-full mx-auto ">
          <InfoCards />
          <TransactionsList />
          <div
            className={`flex gap-2 flex-col sm:gap-8 ${
              grid["balance"] || grid["month"] ? "" : "lg:flex-row"
            }`}
          >
            <BalanceChart />
            <MonthChart />
          </div>

          <CategoryChart />
        </div>
        <Toaster
          toastOptions={{
            style:
              theme === "dark"
                ? {
                    background: "#333",
                    color: "white",
                  }
                : {},
            className: "bg-primary",
          }}
        />
      </>
    );
};

export default Dashboard;
