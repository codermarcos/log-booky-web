import { HTMLInputTypeAttribute } from "react";

type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  isLoading?: boolean;
};

function Input({ id, name, type, isLoading }: InputProps) {
  const inputModes: Record<HTMLInputTypeAttribute, InputProps[''] = {
    
  };
  return (
    <label htmlFor={id}>
      <input
        id={id}
        type={type}
        inputMode={}
        name={name ?? id}
        readOnly={isLoading}
        autoComplete="email"
        placeholder="Digite seu email"
        defaultValue={state.Username}
      />
      {state.status === 'error' && Array.isArray(state.errors?.Username) && (
        <p role="alert">{state.errors?.Username.at(0)}</p>
      )}
    </label>
  );
}
