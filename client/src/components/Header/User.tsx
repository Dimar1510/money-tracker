import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "src/app/hooks";
import { useCurrentQuery } from "src/app/services/userApi";
import { logout } from "src/app/userSlice";
import { CgProfile } from "react-icons/cg";
import CategoryList from "../CategoryList/CategoryList";
import { useGetAllCategoriesQuery } from "src/app/services/categoryApi";
import { useContext, useState } from "react";
import { ThemeContext } from "../ThemeProvider";
import { MdAdd, MdLogout } from "react-icons/md";
import FormTransaction from "../Transactions/FormTransaction";
import { useForm } from "react-hook-form";
import { ITransactionFormItem } from "../Transactions/Transactions";
import Populate from "../Transactions/Populate";
import { useGetAllTransactionsQuery } from "src/app/services/transactionApi";

const User = () => {
  const { data } = useCurrentQuery();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { data: categories } = useGetAllCategoriesQuery();
  const { data: transactions, isLoading } = useGetAllTransactionsQuery();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [error, setError] = useState("");
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { handleSubmit, control, setValue, reset } =
    useForm<ITransactionFormItem>({
      mode: "onChange",
      reValidateMode: "onBlur",
      defaultValues: {
        type: "expense",
      },
    });

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const isTransactionEmpty = transactions
    ? transactions.transactions.length === 0
    : false;

  if (data && categories)
    return (
      <>
        <Dropdown
          shadow="sm"
          style={{ zIndex: 50 }}
          placement="bottom-end"
          className={`${theme} text-foreground pb-4`}
        >
          <DropdownTrigger>
            <div className="cursor-pointer group">
              <CgProfile
                size={35}
                className="group-hover:text-primary transition-colors"
              />
            </div>
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="light">
            <DropdownItem key="user" className="text-center" isReadOnly={true}>
              {data.name}
            </DropdownItem>
            <DropdownItem key="email" className="text-center" isReadOnly={true}>
              {data.email}
            </DropdownItem>
            <DropdownItem key="create" textValue="Создать" isReadOnly={true}>
              <Button
                color="primary"
                variant="light"
                onPress={onOpen}
                className="w-full justify-start"
                startContent={<MdAdd size={20} />}
              >
                Добавить транзакцию
              </Button>
            </DropdownItem>
            <DropdownItem
              key="edit"
              textValue="Редактировать"
              isReadOnly={true}
            >
              <CategoryList data={categories} />
            </DropdownItem>
            <DropdownItem
              key="populate"
              textValue="Заполнить"
              isReadOnly={true}
              showDivider
              className="mb-6"
            >
              <Tooltip
                content="Для загрузки демо очистите таблицу транзакций"
                delay={500}
                isDisabled={isTransactionEmpty}
                placement="bottom-start"
              >
                <div>
                  <Populate disabled={!isTransactionEmpty} />
                </div>
              </Tooltip>
            </DropdownItem>
            <DropdownItem
              key="logout"
              color="danger"
              onClick={handleLogout}
              startContent={<MdLogout size={20} />}
            >
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          className={`${theme} text-foreground`}
          placement="top-center"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  <div className="flex gap-1 items-center">
                    <MdAdd />
                    Создать транзакцию
                  </div>
                </ModalHeader>
                <ModalBody>
                  <FormTransaction
                    edit={null}
                    error={error}
                    setError={setError}
                    control={control}
                    handleSubmit={handleSubmit}
                    reset={reset}
                    onClose={onClose}
                  />
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    );
};

export default User;
