import { z } from 'zod';
import {
  AuthenticationDetails,
  IAuthenticationDetailsData,
  CognitoUser,
} from 'amazon-cognito-identity-js';
import { useRouter } from 'next/navigation';

import { SUB_KEY } from '@/services/cognito';
import CookieStorage from '@/services/cookie';
import { useCognito } from '@/app/cognito.provider';

export type ActionSignIn = {
  status: string;
  errors?: Partial<Record<keyof IAuthenticationDetailsData, Array<string>>>;
} & Partial<IAuthenticationDetailsData>;

export const SignInSchema = z.object({
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

export function useSignIn() {
  const Pool = useCognito();
  const router = useRouter();

  const handler = async ({ Username }: ActionSignIn, formData: FormData) =>
    new Promise<ActionSignIn>((resolve) => {
      const fields = SignInSchema.safeParse(Object.fromEntries(formData.entries()));

      if (!fields.success)
        return resolve({
          status: 'error',
          errors: fields.error.flatten().fieldErrors,
          Username: formData.get('Username')?.toString() || Username,
        });

      const details = new AuthenticationDetails(fields.data);
      const Storage = new CookieStorage();

      const user = new CognitoUser({
        Pool,
        Storage,
        Username: fields.data.Username,
      });

      user.authenticateUser(details, {
        onFailure: () =>
          resolve({
            status: 'error',
            errors: {
              Username: ['Usuário incorreto'],
              Password: ['Senha incorreta'],
            },
          }),
        onSuccess: (user) => {
          Storage.setItem(SUB_KEY, user.getIdToken().payload.sub);
          resolve({ status: 'success' });
          router.push('/entrar/api');
        },
      });
    });

  return handler;
}
