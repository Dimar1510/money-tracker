import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "src/app/hooks";
import { selectIsAuthenticated } from "src/app/userSlice";

const Home = () => {
  const isAuth = useAppSelector(selectIsAuthenticated);
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuth) {
      navigate("/dashboard");
    }
  }, [isAuth, navigate]);
  return <div>Home</div>;
};

export default Home;
