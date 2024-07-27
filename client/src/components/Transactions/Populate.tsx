import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useContext, useState } from "react";
import { MdOutlinePlaylistAddCheck } from "react-icons/md";
import { ThemeContext } from "../ThemeProvider";
import { usePopulateMutation } from "src/app/services/transactionApi";
import { hasErrorField } from "src/utils/has-error-field";
import ErrorMessage from "../ui/error-message/ErrorMessage";

const Populate = ({ disabled }: { disabled?: boolean }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [error, setError] = useState("");
  const [populateTable, status] = usePopulateMutation();

  const handlePopulate = async ({ onClose }: { onClose: () => void }) => {
    try {
      await populateTable().unwrap();
      onClose();
    } catch (error) {
      if (hasErrorField(error)) {
        setError(error.data.error);
      }
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        className={`${theme} text-foreground`}
        isDismissable={!status.isLoading}
        isKeyboardDismissDisabled={status.isLoading}
        hideCloseButton={status.isLoading}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Демонстрация приложения
              </ModalHeader>
              <ModalBody>
                <p>
                  Вы собираетесь внести в таблицу демонстрационный набор данных.
                  Данная операция возможна только при отсутствии транзакций в
                  таблице.
                </p>
                <p className="font-semibold italic">
                  Все текущие категории будут удалены.
                </p>
                <p>Продолжить?</p>
                {status.isLoading && (
                  <p className="text-warning-500">
                    Это займет какое-то время...
                  </p>
                )}
                <ErrorMessage error={error} />
              </ModalBody>
              <ModalFooter>
                <Button isLoading={status.isLoading} onPress={onClose}>
                  Отмена
                </Button>
                <Button
                  isLoading={status.isLoading}
                  color="warning"
                  onPress={() => {
                    handlePopulate({ onClose });
                  }}
                >
                  Заполнить
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Button
        onPress={onOpen}
        color="success"
        variant="faded"
        startContent={<MdOutlinePlaylistAddCheck size={25} />}
        isDisabled={disabled}
      >
        Заполнить таблицу (демонстрация приложения)
      </Button>
    </>
  );
};

export default Populate;
