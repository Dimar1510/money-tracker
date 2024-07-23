import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "src/app/hooks";
import { useGetAllTransactionsQuery } from "src/app/services/transactionApi";
import { selectCurrent, selectIsAuthenticated } from "src/app/userSlice";
import BalanceCard from "src/components/BalanceCard/BalanceCard";
import ExpenseCard from "src/components/ExpenseCard/ExpenseCard";
import IncomeCard from "src/components/IncomeCard/IncomeCard";
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
        <div className="flex gap-2 justify-between min-w-[280px]">
          <BalanceCard />
          <IncomeCard />
          <ExpenseCard />
        </div>
        <TransactionsList />
      </div>
    );
};

export default Dashboard;
