import React from "react";
import { Control, useController } from "react-hook-form";
import { Input as NextInput } from "@nextui-org/react";

type Props = {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  control: Control<any>;
  required?: string;
  endContent?: JSX.Element;
  className?: string;
};

const FormInput: React.FC<Props> = ({
  name,
  label,
  placeholder,
  type,
  control,
  required,
  endContent,
  className,
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
    defaultValue: "",
  });
  return (
    <NextInput
      id={name}
      label={label}
      placeholder={placeholder}
      type={type}
      value={field.value}
      name={field.name}
      isInvalid={invalid}
      onChange={field.onChange}
      onBlur={field.onBlur}
      errorMessage={`${errors[name]?.message ?? ""}`}
      maxLength={16}
      autoComplete="input"
      ref={field.ref}
      className={className}
    />
  );
};

export default FormInput;
