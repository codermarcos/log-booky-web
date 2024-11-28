'use client';

import { useActionState } from 'react';

import { useSignIn, type ActionSignIn } from '@/app/hooks/sign-in.hook';

function SignInForm() {
  const [state, action, isLoading] = useActionState<ActionSignIn, FormData>(
    useSignIn(),
    {
      status: 'initial',
    }
  );

  return (
    <form action={action}>
      
      <label htmlFor="password">
        <input
          id="Password"
          type="password"
          name="Password"
          readOnly={isLoading}
          autoComplete="current-password"
          placeholder="Digite sua senha"
        />
        {state.status === 'error' && Array.isArray(state.errors?.Password) && (
          <p role="alert">{state.errors?.Password.at(0)}</p>
        )}
      </label>

      <button disabled={isLoading}>Entrar</button>
    </form>
  );
}

export default SignInForm;
