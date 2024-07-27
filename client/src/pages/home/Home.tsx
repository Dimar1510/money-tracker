import { Button, Image, Link } from "@nextui-org/react";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "src/app/hooks";
import { selectIsAuthenticated } from "src/app/userSlice";
import FeatureItem from "src/components/FeatureItem/FeatureItem";
import { ThemeContext } from "src/components/ThemeProvider";

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
    <div className="flex flex-col items-center gap-12 mt-8 max-w-[1200px] w-full mx-auto p-8">
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
      <div className="image-box max-h-[600px] overflow-y-scroll border border-primary rounded-lg">
        <Image
          src={
            theme === "dark"
              ? "src/assets/images/dark.png"
              : "src/assets/images/light.png"
          }
        />
      </div>
      <div className="flex flex-col gap-16">
        <FeatureItem
          title="Добавляйте транзакции"
          text=" Вносите свои расходы или доходы для ежедневного учета и Where's
              the money сразу же добавит их в статистику."
          image="src/assets/images/create.png"
        />
        <FeatureItem
          title="Создавайте и редактируйте категории"
          text=" Получайте общую картину трат и прибыли, разбив расходы и доходы по
          категориям."
          image="src/assets/images/categories.png"
        />
        <FeatureItem
          title="Графики расходов"
          text="Позволяют с легкостью отслеживать, куда и сколько денег уходит
          каждый месяц."
          image="src/assets/images/expense.png"
        />
        <FeatureItem
          title="Скрывайте лишнее"
          text="Если информация с какой-либо карточки в данный момент не нужна, ее
          можно скрыть c главной страницы."
          image="src/assets/images/hidden.png"
        />
        <FeatureItem
          title="Экспорт в Excel"
          text="Сохраните таблицу транзакций себе на устройство в формате xlsx для
          дальнейшего анализа или сравнения."
          image="src/assets/images/export.png"
        />
      </div>
    </div>
  );
};

export default Home;
