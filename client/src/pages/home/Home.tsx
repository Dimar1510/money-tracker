import { Button, Divider, Image, Link } from "@nextui-org/react";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "src/app/hooks";
import { selectIsAuthenticated } from "src/app/userSlice";
import { ThemeContext } from "src/components/ThemeProvider";
import HomeCards from "src/components/HomeCards/HomeCards";
import darkHero from "src/assets/images/dark.png";
import hero from "src/assets/images/light.png";

const Home = () => {
  const isAuth = useAppSelector(selectIsAuthenticated);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuth) {
      navigate("/dashboard");
    }
  }, [isAuth, navigate]);

  return (
    <div className="flex flex-col items-center gap-20 mt-8 max-w-[1000px] w-full mx-auto p-8">
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-5xl text-center">
          Организуйте <br /> свои финансы.
        </h1>
        <h2 className="text-lg text-center">
          Отслеживайте расходы и доходы <br />и получайте наглядные отчеты.
        </h2>

        <Button
          as={Link}
          href="/register"
          size="lg"
          color="primary"
          className="text-default-50 font-semibold"
        >
          Попробовать
        </Button>
      </div>
      <div className="image-box flex justify-center w-full max-h-[600px] overflow-y-scroll border border-default-500 rounded-md">
        <Image className="" src={theme === "dark" ? darkHero : hero} />
      </div>
      <HomeCards />
      <Divider />
      <div className="flex flex-col items-center gap-6 w-full">
        <h1 className="text-3xl text-center">
          Обретите ясность в своих домашних финансах вместе с <br />
          Where's the money.
        </h1>
        <h2 className="text-lg text-center">
          Просматривайте свои транзакции, отслеживайте расходы по категориям и
          получайте ежемесячные аналитические данные, которые помогут вам лучше
          понять свои финансовые привычки.
        </h2>

        <Button
          as={Link}
          href="/register"
          size="lg"
          color="primary"
          className="text-default-50 font-semibold"
        >
          Попробовать
        </Button>
      </div>
    </div>
  );
};

export default Home;
