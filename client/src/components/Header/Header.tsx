import { Input } from "@nextui-org/react";
import { FaSearch } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useAppSelector } from "src/app/hooks";
import { selectIsAuthenticated } from "src/app/userSlice";
import User from "./User";

const Header = () => {
  const isAuth = useAppSelector(selectIsAuthenticated);
  return (
    <header className="bg-default-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <NavLink to={"/"}>
          <h1 className="font-bold text-sm xs:text-medium sm:text-xl flex flex-wrap">
            <span className="text-default-500">Finance</span>
            <span className="text-default-800">Tracker</span>
          </h1>
        </NavLink>
        <ul className="flex gap-4 items-center">
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
