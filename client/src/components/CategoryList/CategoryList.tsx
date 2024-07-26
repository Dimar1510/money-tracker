import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { FC, useContext, useState } from "react";
import { ThemeContext } from "../ThemeProvider";
import {
  ICategory,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} from "src/app/services/categoryApi";
import { _capitalise } from "ag-grid-community";
import {
  MdDeleteOutline,
  MdOutlineCancel,
  MdOutlineEdit,
} from "react-icons/md";
import { FiSave } from "react-icons/fi";
import normalizeString from "src/utils/normalizeString";
import ErrorMessage from "../ui/error-message/ErrorMessage";
import { hasErrorField } from "src/utils/has-error-field";
interface IProps {
  data: ICategory[];
}

const CategoryList: FC<IProps> = ({ data }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [value, setValue] = useState<string>("");
  const [edit, setEdit] = useState<string | null>(null);
  const [deleteItem, setDeleteItem] = useState<string | null>(null);
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [error, setError] = useState("");
  const categories: ICategory[] = [];
  const handleSelectionChange = (key: React.Key | null) => {
    setDeleteItem(null);
    setEdit(null);
    setError("");
    if (key !== null) {
      setValue(key as string);
    }
  };

  const handleSave = async () => {
    const category = categories.find((item) => item.name === value);
    if (category) {
      const id = category.id;
      const newName = edit ? normalizeString(edit) : null;
      if (category.name !== newName) {
        if (categories.find((item) => item.name === newName)) {
          setError("Такая категория уже существует");
        } else {
          try {
            if (newName) await updateCategory({ name: newName, id });
            setError("");
          } catch (error) {
            if (hasErrorField(error)) {
              setError(error.data.error);
            }
          } finally {
            setValue("");
            setEdit(null);
          }
        }
      } else {
        setEdit(null);
      }
    }
  };

  const handleDelete = async () => {
    const category = categories.find((item) => item.name === value);
    if (category) {
      const id = category.id;
      try {
        await deleteCategory(id);
        setError("");
      } catch (error) {
        if (hasErrorField(error)) {
          setError(error.data.error);
        }
      } finally {
        setDeleteItem(null);
        setValue("");
        setEdit(null);
      }
    }
  };

  if (data) {
    data.forEach((item) => {
      if (item.name !== "__other") categories.push(item);
    });
    if (categories.length > 0)
      return (
        <>
          <Button
            onPress={() => {
              onOpen();
              setDeleteItem(null);
              setEdit(null);
              setValue("");
            }}
            color="primary"
            variant="faded"
            startContent={<MdOutlineEdit size={15} />}
          >
            Редактировать категории
          </Button>
          <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            className={`${theme} text-foreground pb-4`}
          >
            <ModalContent>
              {() => (
                <>
                  <ModalHeader className="flex flex-col gap-1 items-center">
                    Мои категории
                  </ModalHeader>
                  <ModalBody className="items-center">
                    {
                      <Autocomplete
                        label="Категории"
                        variant="bordered"
                        defaultItems={categories}
                        placeholder="Выберете категорию"
                        className="max-w-xs"
                        selectedKey={value}
                        onSelectionChange={handleSelectionChange}
                      >
                        {(item) => (
                          <AutocompleteItem key={item.name}>
                            {_capitalise(item.name)}
                          </AutocompleteItem>
                        )}
                      </Autocomplete>
                    }
                    <ErrorMessage error={error} />
                    {deleteItem && (
                      <div className="flex flex-col gap-4 items-center text-center">
                        <p className="text-danger-400">
                          Вы уверены, что хотите удалить{" "}
                          {
                            <span className="font-semibold">
                              {_capitalise(value)}
                            </span>
                          }
                          ?
                        </p>
                        <p>
                          Все транзакции под данной категорией будут помечены
                          как "Без категории".
                        </p>
                        <div className="flex gap-4">
                          <Button onPress={() => setDeleteItem(null)}>
                            Отмена
                          </Button>
                          <Button color="danger" onPress={handleDelete}>
                            Удалить
                          </Button>
                        </div>
                      </div>
                    )}
                    {value && !deleteItem && (
                      <div className="flex flex-col items-center w-full">
                        <p className="text-default-500 text-small">
                          {edit !== null
                            ? `Переименовать категорию ${_capitalise(value)}`
                            : "Выбрана категория:"}
                        </p>
                        <div className="flex justify-around w-full py-4">
                          {edit !== null ? (
                            <input
                              value={edit}
                              onChange={(e) => setEdit(e.target.value)}
                              maxLength={16}
                            />
                          ) : (
                            _capitalise(value)
                          )}
                          {edit !== null ? (
                            <div className="flex gap-3">
                              <button
                                onClick={() => setEdit(null)}
                                className="hover:text-default-500"
                              >
                                <MdOutlineCancel size={25} />
                              </button>
                              <button
                                onClick={handleSave}
                                className="hover:text-primary"
                              >
                                <FiSave size={25} />
                              </button>
                            </div>
                          ) : (
                            <div className="flex gap-3">
                              <button
                                onClick={() => setEdit(value)}
                                className="hover:text-primary"
                              >
                                <MdOutlineEdit size={25} />
                              </button>
                              <button
                                onClick={() => setDeleteItem(value)}
                                className="hover:text-danger-500"
                              >
                                <MdDeleteOutline size={25} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </ModalBody>
                </>
              )}
            </ModalContent>
          </Modal>
        </>
      );
  }
};

export default CategoryList;
