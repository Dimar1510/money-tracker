import { Button } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "src/app/hooks";
import {
  useLoginMutation,
  useRegisterMutation,
} from "src/app/services/userApi";
import { selectIsAuthenticated } from "src/app/userSlice";
import FormInput from "src/components/ui/FormInput/FormInput";
import ErrorMessage from "src/components/ui/error-message/ErrorMessage";
import { hasErrorField } from "src/utils/has-error-field";

interface IRegister {
  name: string;
  email: string;
  password: string;
  password_repeat: string;
}

const Register = () => {
  const isAuth = useAppSelector(selectIsAuthenticated);
  const { handleSubmit, control, getValues } = useForm<IRegister>({
    mode: "onChange",
    reValidateMode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_repeat: "",
    },
  });

  const [register, regResult] = useRegisterMutation();
  const [login, logResult] = useLoginMutation();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuth) {
      navigate("/");
    }
  }, [isAuth, navigate]);

  const onSubmit = async (data: IRegister) => {
    if (getValues("password") !== getValues("password_repeat")) {
      setError("Пароли не совпадают");
      return;
    }
    try {
      await register(data).unwrap();
      await login(data).unwrap();
      navigate("/dashboard");
    } catch (error) {
      if (hasErrorField(error)) {
        setError(error.data.error);
      }
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h2 className="text-center my-7">Войти</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormInput
          control={control}
          name="name"
          label="Имя"
          type="text"
          required="Введите имя"
        />
        <FormInput
          control={control}
          name="email"
          label="Email"
          type="email"
          required="Введите email"
        />
        <FormInput
          control={control}
          name="password"
          label="Пароль"
          type="password"
          required="Введите пароль"
        />
        <FormInput
          control={control}
          name="password_repeat"
          label="Повторите пароль"
          type="password"
        />

        <ErrorMessage error={error} />
        <Button
          color="primary"
          type="submit"
          isLoading={regResult.isLoading || logResult.isLoading}
          className="text-default-100 font-medium"
        >
          Регистрация
        </Button>
      </form>
      <div className="flex gap-2 justify-center my-3">
        <p>Уже зарегистрированы?</p>
        <Link to={"/login"} className="text-primary font-semibold">
          Войти
        </Link>
      </div>
    </div>
  );
};

export default Register;
