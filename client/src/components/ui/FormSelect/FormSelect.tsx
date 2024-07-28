import React from "react";
import { Control, useController } from "react-hook-form";
import { Select, SelectItem } from "@nextui-org/react";
import { FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa";

interface Props {
  name: string;
  label: string;
  placeholder?: string;
  control: Control<any>;
  required?: string;
  content?: JSX.Element;
  items: {
    key: string;
    label: string;
  }[];
}

const FormSelect: React.FC<Props> = ({
  name,
  label,
  placeholder,
  control,
  required,
  items,
  content,
}) => {
  const {
    field,
    fieldState: { invalid },
    formState: { errors },
  } = useController({
    name,
    control,
    rules: {
      required,
    },
  });

  return (
    <div className="flex gap-1 flex-1 items-center">
      <Select
        startContent={
          field.value === "income" ? (
            <FaLongArrowAltUp className="text-success-600" />
          ) : (
            field.value === "expense" && (
              <FaLongArrowAltDown className="text-danger-800" />
            )
          )
        }
        items={items}
        id={name}
        label={label}
        placeholder={placeholder}
        selectedKeys={[field.value]}
        name={field.name}
        isInvalid={invalid}
        onChange={field.onChange}
        onBlur={field.onBlur}
        errorMessage={`${errors[name]?.message ?? ""}`}
      >
        {(item) => (
          <SelectItem
            startContent={
              item.key === "income" ? (
                <FaLongArrowAltUp className="text-success-600" />
              ) : (
                item.key === "expense" && (
                  <FaLongArrowAltDown className="text-danger-800" />
                )
              )
            }
            key={item.key}
          >
            {item.label}
          </SelectItem>
        )}
      </Select>
    </div>
  );
};

export default FormSelect;
