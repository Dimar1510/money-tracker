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
        <form>
          <Input
            placeholder="Search..."
            startContent={<FaSearch />}
            type="search"
            className="w-24 xs:w-48 sm:w-64"
          />
        </form>
        <ul className="flex gap-4 items-center">
          <li className="hidden sm:inline hover:underline">
            <NavLink to={"/"}>Home</NavLink>
          </li>
          <li className="hidden sm:inline hover:underline">
            <NavLink to={"/about"}>About</NavLink>{" "}
          </li>

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
