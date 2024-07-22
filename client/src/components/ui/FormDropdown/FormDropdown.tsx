import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import React, { FC } from "react";

interface IProps {
  categories: {
    key: string;
    label: string;
  }[];
  selectedCategory: string;
}

const FormDropdown: FC<IProps> = ({ categories, selectedCategory }) => {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="bordered">{selectedCategory}</Button>
      </DropdownTrigger>

      <DropdownMenu aria-label="Static Actions">
        {categories.map((cat) => (
          <DropdownItem key={cat.key}>{cat.label}</DropdownItem>
        ))}

        <DropdownItem key="delete" className="text-danger" color="danger">
          New cat
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default FormDropdown;
