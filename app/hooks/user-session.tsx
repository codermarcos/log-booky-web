'use client';

import { CognitoUserSession } from 'amazon-cognito-identity-js';
import { useRouter, usePathname } from 'next/navigation';
import { use } from 'react';

import { useCognito } from '@/app/cognito.provider';
import { AUTH_URL } from '@/middleware';

export function useUserSession() {
  const pathname = usePathname();
  const cognito = useCognito();
  const router = useRouter();

  const redirect = () => {
    if (!AUTH_URL.includes(pathname)) router.push('/entrar');
  };
  
  return use(
    new Promise<CognitoUserSession | void>((resolve, reject) => {
      const currentUser = cognito.getCurrentUser();

      if (!currentUser) return resolve(redirect());

      currentUser.getSession(
        (...[error, session]: [Error, null] | [null, CognitoUserSession]) =>
          error === null ? resolve(session) : reject(error)
      );
    })
  );
}
