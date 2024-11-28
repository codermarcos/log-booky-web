'use client';

import { useActionState } from 'react';

import { useSignUp } from '@/app/hooks/sign-up.hook';

function SignInForm() {
  const [state, action, isLoading] = useActionState(useSignUp(), {
    status: 'initial',
  });

  return (
    <form action={action}>
      <label htmlFor="Username">
        <input
          id="Username"
          type="email"
          name="Username"
          readOnly={isLoading}
          autoComplete="email"
          placeholder="Digite seu email"
        />
        {state.status === 'error' && Array.isArray(state.errors?.Username) && (
          <p role="alert">{state.errors?.Username.at(0)}</p>
        )}
      </label>
      <label htmlFor="Password">
        <input
          id="Password"
          type="password"
          name="Password"
          readOnly={isLoading}
          autoComplete="current-password"
          placeholder="Crie uma senha"
        />
        {state.status === 'error' && Array.isArray(state.errors?.Password) && (
          <p role="alert">{state.errors?.Password.at(0)}</p>
        )}
      </label>

      <button disabled={isLoading}>Cadastrar</button>
    </form>
  );
}

export default SignInForm;
