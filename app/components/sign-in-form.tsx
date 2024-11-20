"use client";

import { useActionState } from "react";

async function signIn(previousState, formData) {
  console.log(previousState, formData);
  return previousState + 1;
}

function SignInForm() {
  const [state, formAction] = useActionState(signIn, {
    email: "",
    password: "",
  });

  return (
    <form action={formAction}>
      <label htmlFor="email">
        <input
          id="email"
          type="email"
          name="email"
          autoComplete="email"
          placeholder=""
          defaultValue={state.email}
        />
      </label>
      <label htmlFor="password">
        <input
          id="password"
          type="password"
          name="email"
          autoComplete="current-password"
          defaultValue={state.password}
        />
      </label>

      <button>Entrar</button>
    </form>
  );
}

export default SignInForm;
