import { NavLink } from "react-router-dom";
import { useAppSelector } from "src/app/hooks";
import { selectIsAuthenticated } from "src/app/userSlice";
import User from "./User";
import { Switch } from "@nextui-org/react";
import { FaRegMoon, FaSun } from "react-icons/fa";
import { useContext } from "react";
import { ThemeContext } from "../ThemeProvider";
import { GiTakeMyMoney } from "react-icons/gi";

const Header = () => {
  const isAuth = useAppSelector(selectIsAuthenticated);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const themeSelected = theme === "light";
  return (
    <header className="bg-default-50 shadow-md w-full fixed z-50">
      <div className="flex justify-between items-center max-w-6xl mx-auto px-4 py-1">
        <NavLink to={"/"}>
          <h2 className="font-bold flex items-center gap-2">
            <div>
              <GiTakeMyMoney size={55} className="text-primary" />
            </div>
            <div className="xs:flex flex-col hidden">
              <span className="text-default-600 uppercase text-sm sm:text-xl">
                Where's the money?
              </span>
              <span className="text-default-400 text-[10px] [line-height:12px] sm:text-sm uppercase">
                Трекер расходов и доходов
              </span>
            </div>
          </h2>
        </NavLink>
        <ul className="flex gap-4 items-center">
          <Switch
            isSelected={!themeSelected}
            size="md"
            onValueChange={toggleTheme}
            endContent={<FaSun />}
            startContent={<FaRegMoon />}
            color="primary"
          ></Switch>
          {isAuth ? (
            <>
              <User />
            </>
          ) : (
            <div className="flex flex-row gap-x-4 gap-y-1">
              <li className="hover:underline underline-offset-4">
                <NavLink to={"/login"}>Вход</NavLink>
              </li>
              <li className="hover:underline underline-offset-4">
                <NavLink to={"/register"}>Регистрация</NavLink>
              </li>
            </div>
          )}
        </ul>
      </div>
    </header>
  );
};

export default Header;
