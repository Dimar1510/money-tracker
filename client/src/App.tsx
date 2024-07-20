import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import NotFound from "./pages/404/NotFound";
import Header from "./components/Header/Header";
import { NextUIProvider } from "@nextui-org/react";
import Dashboard from "./pages/dashboard/Dashboard";

const App = () => {
  const navigate = useNavigate();
  return (
    <NextUIProvider navigate={navigate}>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </NextUIProvider>
  );
};

export default App;
