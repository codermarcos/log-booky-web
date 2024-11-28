'use client';

import {
  CognitoUserPool,
  ICognitoUserPoolData,
} from 'amazon-cognito-identity-js';
import { createContext, PropsWithChildren, useContext } from 'react';

import CookieStorage from '@/services/cookie';
import {
  COGNITO_USER_POOL_CLIENT_ID,
  COGNITO_USER_POOL_ID,
} from '@/services/cognito';

const getOptions = (cookie?: string): ICognitoUserPoolData => ({
  ClientId: COGNITO_USER_POOL_CLIENT_ID,
  Storage: new CookieStorage(cookie),
  UserPoolId: COGNITO_USER_POOL_ID,
});

export const cognito = new CognitoUserPool(getOptions());

export const CognitoContext = createContext(cognito);

type Props = PropsWithChildren<{
  cookies?: string;
}>;

export function CognitoProvider({ children, cookies }: Props) {
  const userPool =
    typeof cookies === 'string'
      ? new CognitoUserPool(getOptions(cookies))
      : cognito;
  return (
    <CognitoContext.Provider value={userPool}>
      {children}
    </CognitoContext.Provider>
  );
}

export function useCognito() {
  const cognito = useContext(CognitoContext);

  return cognito;
}
