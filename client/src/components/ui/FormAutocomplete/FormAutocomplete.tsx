import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { Control, useController } from "react-hook-form";
import {
  ICategory,
  useGetAllCategoriesQuery,
} from "src/app/services/categoryApi";

type Props = {
  name: string;
  label: string;
  placeholder?: string;
  control: Control<any>;
  required?: string;
};

const FormAutocomplete: React.FC<Props> = ({
  name,
  label,
  placeholder,
  control,
  required,
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
  const { data } = useGetAllCategoriesQuery();

  const categories: ICategory[] = [];
  if (data)
    if (data) {
      data.forEach((item) => {
        if (item.name !== "__other") categories.push(item);
      });
      return (
        <Autocomplete
          id={name}
          label={label}
          placeholder={placeholder}
          allowsCustomValue
          variant="bordered"
          defaultItems={categories}
          inputValue={field.value}
          name={field.name}
          onInputChange={field.onChange}
          onBlur={field.onBlur}
          errorMessage={`${errors[name]?.message ?? ""}`}
          maxLength={16}
          autoComplete="input"
          aria-hidden={false}
        >
          {(item) => (
            <AutocompleteItem key={item.name}>{item.name}</AutocompleteItem>
          )}
        </Autocomplete>
      );
    }
};

export default FormAutocomplete;
