import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useContext } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { ThemeContext } from "../ThemeProvider";

const DeleteMany = ({
  handleDeleteMany,
  count,
  isLoading,
  isSuccess,
}: {
  handleDeleteMany: () => void;
  count: number;
  isLoading: boolean;
  isSuccess: boolean;
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { theme } = useContext(ThemeContext);
  return (
    <>
      <Button
        onClick={onOpen}
        color="danger"
        variant="bordered"
        startContent={<MdDeleteOutline size={20} />}
      >
        Удалить: {count}
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        className={`${theme} text-foreground`}
        isDismissable={!isLoading}
        isKeyboardDismissDisabled={isLoading}
        hideCloseButton={isLoading}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex gap-1 items-center">
                <MdDeleteOutline /> Удалить транзакции
              </ModalHeader>
              <ModalBody>
                <p>
                  {`Вы уверены, что хотите удалить  ${count} ${
                    count % 10 === 1
                      ? "транзакцию"
                      : count % 10 > 4
                      ? "транзакций"
                      : "транзакции"
                  }?`}
                </p>
              </ModalBody>
              <ModalFooter>
                <Button isLoading={isLoading} onPress={onClose}>
                  Отмена
                </Button>
                <Button
                  isLoading={isLoading}
                  color="danger"
                  onPress={() => {
                    handleDeleteMany();
                    isSuccess && onClose();
                  }}
                >
                  Удалить
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default DeleteMany;
