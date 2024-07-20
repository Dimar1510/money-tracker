import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "src/app/hooks";
import { selectIsAuthenticated } from "src/app/userSlice";

const Dashboard = () => {
  const isAuth = useAppSelector(selectIsAuthenticated);
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuth) {
      navigate("/");
    }
  }, [isAuth, navigate]);
  return <div>Dashboard</div>;
};

export default Dashboard;
