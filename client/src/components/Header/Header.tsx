import { NavLink } from "react-router-dom";
import { useAppSelector } from "src/app/hooks";
import { selectIsAuthenticated } from "src/app/userSlice";
import User from "./User";
import { Switch } from "@nextui-org/react";
import { FaRegMoon, FaSun } from "react-icons/fa";
import { useContext } from "react";
import { ThemeContext } from "../ThemeProvider";

const Header = () => {
  const isAuth = useAppSelector(selectIsAuthenticated);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const themeSelected = theme === "light";
  return (
    <header className="bg-default-50 shadow-md w-full">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <NavLink to={"/"}>
          <h1 className="font-bold text-sm xs:text-medium sm:text-xl flex flex-wrap">
            <span className="text-default-500">Finance</span>
            <span className="text-default-800">Tracker</span>
          </h1>
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
            <div className="flex flex-col xs:flex-row gap-x-4 gap-y-1">
              <li className="hover:underline">
                <NavLink to={"/login"}>Sign in</NavLink>
              </li>
              <li className="hover:underline">
                <NavLink to={"/register"}>Register</NavLink>
              </li>
            </div>
          )}
        </ul>
      </div>
    </header>
  );
};

export default Header;
