"use client";

import { useActionState } from "react";

import { useLogin } from "@/app/hooks/auth";
import { useFormState } from "react-dom";
import { LoginSchema } from "../hooks/auth.validade";

type FormLogin = {
  status: string;
  email?: string;
  password?: string;
  errors?: Record<string, Array<string>>;
};

function SignInForm() {
  const { trigger } = useLogin();

  const handleLogin = async (
    _: FormLogin,
    formData: FormData
  ): Promise<FormLogin> => {
    const response: FormLogin = {
      status: "error",
      password: "",
      email: "",
    };

    const fields = LoginSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!fields.success)
      return {
        status: "error",
        errors: fields.error.flatten().fieldErrors,
      };

    await trigger({
      Username: fields.data.email,
      Password: fields.data.password,
    });

    response.status = "success";

    return response;
  };

  const [state, formAction, isPending] = useFormState(handleLogin, {
    status: "initial",
  });

  return (
    <form action={formAction}>
      <label htmlFor="email">
        <input
          id="email"
          type="email"
          name="email"
          readOnly={isPending}
          autoComplete="email"
          placeholder="Digite seu email"
          defaultValue={state.email}
        />
      </label>
      <label htmlFor="password">
        <input
          id="password"
          type="password"
          name="password"
          readOnly={isPending}
          autoComplete="current-password"
          placeholder="Digite sua senha"
          defaultValue={state.password}
        />
      </label>

      <button disabled={isPending}>Entrar</button>
    </form>
  );
}

export default SignInForm;
