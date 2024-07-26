import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "src/app/hooks";
import { selectCurrent, selectIsAuthenticated } from "src/app/userSlice";
import BalanceChart from "src/components/Charts/BalanceChart";
import ByCategory from "src/components/Charts/ByCategory";
import ByMonth from "src/components/Charts/ByMonth";
import InfoCards from "src/components/InfoCards/InfoCards";
import TransactionsList from "src/components/Transactions/Transactions";

const Dashboard = () => {
  const isAuth = useAppSelector(selectIsAuthenticated);
  const current = useAppSelector(selectCurrent);
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuth) {
      navigate("/");
    }
  }, [isAuth, navigate]);

  if (current)
    return (
      <div className="flex gap-8 flex-col p-8 flex-1 max-w-[1200px] w-full">
        <InfoCards />
        <TransactionsList />
        <BalanceChart />
        <ByMonth />
        <ByCategory />
      </div>
    );
};

export default Dashboard;
