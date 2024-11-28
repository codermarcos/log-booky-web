import { CognitoUser } from 'amazon-cognito-identity-js';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useCognito } from '../cognito.provider';

type FormConfirm = {
  Username?: string;
  code?: string;
};

export type ActionConfirm = {
  status: string;
  errors?: Partial<Record<keyof FormConfirm, Array<string>>>;
} & Partial<FormConfirm>;

export const ConfirmSchema = z.object({
  Username: z
    .string({
      required_error: 'Email é obrigatório.',
    })
    .email('Email invalido'),
  code: z
    .string({
      required_error: 'O código é obrigatório.',
    })
    .min(6, 'O código deve conter no minimo 6 caracteres')
    .max(6, 'O código deve conter no maximo 6 caracteres')
    .regex(/^\d+$/, 'O código deve conter apenas numeros'),
});

export function useConfirm() {
  const router = useRouter();
  const Pool = useCognito();

  const handler = async (
    { Username }: ActionConfirm,
    formData: FormData
  ): Promise<ActionConfirm> =>
    new Promise((resolve) => {
      const fields = ConfirmSchema.safeParse(Object.fromEntries(formData.entries()));

      if (!fields.success)
        return resolve({
          status: 'error',
          errors: fields.error.flatten().fieldErrors,
          Username: formData.get('Username')?.toString() || Username,
        });

      const user = new CognitoUser({
        Pool,
        Username: fields.data.Username,
      });
      
      user.confirmRegistration(fields.data.code, false, (error) => {
        resolve({
          status: error ? 'error' : 'success',
        });

        if (!error) router.push('/entrar');
      });
    });

  return handler;
}
