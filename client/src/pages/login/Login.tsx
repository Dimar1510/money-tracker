import { Button } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "src/app/hooks";
import { useLoginMutation } from "src/app/services/userApi";
import { selectIsAuthenticated } from "src/app/userSlice";
import FormInput from "src/components/ui/FormInput/FormInput";
import ErrorMessage from "src/components/ui/error-message/ErrorMessage";
import { hasErrorField } from "src/utils/has-error-field";

interface ILogin {
  email: string;
  password: string;
}

const Login = () => {
  const isAuth = useAppSelector(selectIsAuthenticated);
  const { handleSubmit, control } = useForm<ILogin>({
    mode: "onChange",
    reValidateMode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [login, result] = useLoginMutation();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuth) {
      navigate("/");
    }
  }, [isAuth, navigate]);

  const onSubmit = async (data: ILogin) => {
    try {
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

        <ErrorMessage error={error} />
        <Button
          color="primary"
          type="submit"
          isLoading={result.isLoading}
          className="text-default-100 font-medium"
        >
          Войти
        </Button>
      </form>
      <div className="flex gap-2 justify-center my-3">
        <p>Еще не зарегистрированы?</p>
        <Link to={"/register"} className="text-primary font-semibold">
          Регистрация
        </Link>
      </div>
    </div>
  );
};

export default Login;
