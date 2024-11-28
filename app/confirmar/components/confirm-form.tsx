'use client';

import { useActionState } from 'react';
import { useSearchParams } from 'next/navigation';

import { useConfirm } from '@/app/hooks/confirm-sign-up.hook';

function ConfirmForm() {
  const router = useSearchParams();

  const UsernameSearchParam = router.get('email');

  const Username =
    typeof UsernameSearchParam === 'string' && UsernameSearchParam.length
      ? UsernameSearchParam
      : '';

  const [state, action, isPending] = useActionState(useConfirm(), {
    status: 'initial',
    Username,
  });

  return (
    <form action={action}>
      <label htmlFor="Username">
        <input
          id="Username"
          type="email"
          name="Username"
          autoComplete="email"
          defaultValue={state.Username}
          readOnly={state.Username !== ''}
          placeholder="Digite o seu email"
        />
        {state.status === 'error' && Array.isArray(state.errors?.Username) && (
          <p role="alert">{state.errors?.Username.at(0)}</p>
        )}
      </label>
      <label htmlFor="code">
        <input
          id="code"
          type="number"
          inputMode="numeric"
          name="code"
          minLength={6}
          maxLength={6}
          readOnly={isPending}
          autoComplete="one-time-code"
          placeholder="Digite o código enviado no seu email"
          defaultValue={state.code}
        />
        {state.status === 'error' && Array.isArray(state.errors?.code) && (
          <p role="alert">{state.errors?.code.at(0)}</p>
        )}
      </label>

      <button disabled={isPending}>Confirmar</button>
    </form>
  );
}

export default ConfirmForm;
