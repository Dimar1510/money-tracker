import React from "react";
import { Control, useController } from "react-hook-form";
import { Select, SelectItem } from "@nextui-org/react";

type Props = {
  name: string;
  label: string;
  placeholder?: string;
  control: Control<any>;
  required?: string;
  endContent?: JSX.Element;
  items: {
    key: string;
    label: string;
  }[];
};

const FormSelect: React.FC<Props> = ({
  name,
  label,
  placeholder,
  control,
  required,
  items,
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
    <Select
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
      {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
    </Select>
  );
};

export default FormSelect;
