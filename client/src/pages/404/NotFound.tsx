import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="h-svh flex flex-col gap-10 justify-center items-center">
      <h1 className="text-7xl">404</h1>
      <h2>Страница не найдена</h2>
      <Link className="text-xl underline underline-offset-4" to={"/"}>
        Перейти на главную
      </Link>
    </div>
  );
};

export default NotFound;
