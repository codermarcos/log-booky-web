'use client';

import { useActionState } from 'react';

import { useSaveJump } from '@/app/hooks/save-jump.hook';

function JumpForm() {
  const [state, action, isLoading] = useActionState(useSaveJump(), {
    status: 'initial',
  });

  return (
    <form action={action}>
      <label htmlFor="locale">
        <input
          id="locale"
          type="text"
          name="locale"
          readOnly={isLoading}
          autoComplete="drop-zone"
          aria-invalid={
            state.status === 'error' && Array.isArray(state.errors?.locale)
          }
          aria-errormessage="locale-error"
          placeholder="Digite o nome ou local da area de salto"
        />
        {state.status === 'error' && Array.isArray(state.errors?.locale) && (
          <p id="locale-error" role="alert">
            {state.errors?.locale.at(0)}
          </p>
        )}
      </label>
      <label htmlFor="date">
        <input
          id="date"
          type="date"
          name="date"
          readOnly={isLoading}
          autoComplete="date"
          aria-invalid={
            state.status === 'error' && Array.isArray(state.errors?.date)
          }
          aria-errormessage="date-error"
          placeholder="Que dia foi o salto"
        />
        {state.status === 'error' && Array.isArray(state.errors?.date) && (
          <p id="date-error" role="alert">
            {state.errors?.date.at(0)}
          </p>
        )}
      </label>
      <label htmlFor="time">
        <input
          id="time"
          type="time"
          name="time"
          readOnly={isLoading}
          autoComplete="time"
          placeholder="Que horas foi o salto"
        />
        {state.status === 'error' && Array.isArray(state.errors?.time) && (
          <p role="alert">{state.errors?.time.at(0)}</p>
        )}
      </label>
      <label htmlFor="canopy">
        <input
          id="canopy"
          type="number"
          inputMode="numeric"
          name="canopy"
          readOnly={isLoading}
          autoComplete="canopy"
          placeholder="Qual equipamento o tamanho do equipamento"
        />
        {state.status === 'error' && Array.isArray(state.errors?.canopy) && (
          <p role="alert">{state.errors?.canopy.at(0)}</p>
        )}
      </label>

      <label htmlFor="notes">
        <input
          id="notes"
          type="text"
          name="notes"
          readOnly={isLoading}
          autoComplete="jump-notes"
          placeholder="Como foi o salto"
        />
        {state.status === 'error' && Array.isArray(state.errors?.notes) && (
          <p role="alert">{state.errors?.notes.at(0)}</p>
        )}
      </label>

      <button disabled={isLoading}>Cadastrar</button>
    </form>
  );
}

export default JumpForm;
