import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import React, { useContext } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { ThemeContext } from "../ThemeProvider";

const DeleteMany = ({
  handleDeleteMany,
  count,
}: {
  handleDeleteMany: () => void;
  count: number;
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <>
      <Button onClick={onOpen} startContent={<MdDeleteOutline />}>
        Удалить: {count}
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        className={`${theme} text-foreground`}
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
                <Button onPress={onClose}>Отмена</Button>
                <Button
                  color="danger"
                  onPress={() => {
                    handleDeleteMany();
                    onClose();
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
