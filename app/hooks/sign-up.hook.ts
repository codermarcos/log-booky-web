import { z } from 'zod';
import {
  CognitoUserAttribute,
  IAuthenticationDetailsData,
} from 'amazon-cognito-identity-js';
import { useRouter } from 'next/navigation';

import { useCognito } from '@/app/cognito.provider';

export type ActionSignUp = {
  status: string;
  errors?: Partial<Record<keyof IAuthenticationDetailsData, Array<string>>>;
} & Partial<IAuthenticationDetailsData>;

export const SignUpSchema = z.object({
  Username: z
    .string({
      required_error: 'Email é obrigatório.',
    })
    .email('Email invalido'),
  Password: z
    .string({
      required_error: 'Senha é obrigatória',
    })
    .min(6, 'Senha deve conter no minimo 6 caracteres')
    .regex(
      /(?=.*[a-z])(?=.*[A-Z])/,
      'Senha deve conter letras maiuscolas e minuscolas'
    )
    .regex(/(?=.*[0-9])/, 'Senha deve conter ao menos um numero'),
});

export function useSignUp() {
  const router = useRouter();
  const cognito = useCognito();

  const handler = async (
    { Username }: ActionSignUp,
    formData: FormData
  ): Promise<ActionSignUp> =>
    new Promise((resolve) => {
      const fields = SignUpSchema.safeParse(Object.fromEntries(formData.entries()));

      if (!fields.success)
        return resolve({
          status: 'error',
          errors: fields.error.flatten().fieldErrors,
          Username: formData.get('Username')?.toString() || Username,
        });

      const attributes = [
        new CognitoUserAttribute({
          Name: 'email',
          Value: fields.data.Username,
        }),
      ];

      cognito.signUp(
        fields.data.Username,
        fields.data.Password,
        attributes,
        attributes,
        (error) => {
          resolve({
            status: error ? 'error' : 'success',
          });
          router.push(`/confirmar?email=${fields.data.Username}`);
        }
      );
    });

  return handler;
}
