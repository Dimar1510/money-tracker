import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "src/app/hooks";
import { useCurrentQuery } from "src/app/services/userApi";
import { logout } from "src/app/userSlice";
import { CgProfile } from "react-icons/cg";

const User = () => {
  const { data } = useCurrentQuery();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  if (data)
    return (
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <div className="cursor-pointer group">
            <CgProfile
              size={35}
              className="group-hover:text-primary transition-colors"
            />
          </div>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Profile Actions"
          variant="light"
          disabledKeys={["user", "email"]}
        >
          <DropdownItem key="user" className="text-center">
            {data.name}
          </DropdownItem>
          <DropdownItem key="email" className="text-center">
            {data.email}
          </DropdownItem>
          <DropdownItem key="logout" color="danger" onClick={handleLogout}>
            Log Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
};

export default User;
