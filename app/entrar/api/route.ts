import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';
import { NextResponse, type NextRequest } from 'next/server';

import {
  AWS_REGION,
  COGNITO_IDENTITY_ID,
  COGNITO_PREFIX_KEY,
  COGNITO_USER_POOL_ID,
  INDENTITY_KEY,
} from '@/services/cognito';

export async function GET(request: NextRequest) {
  const email = request.cookies.get(`${COGNITO_PREFIX_KEY}.LastAuthUser`);
  const token = request.cookies.get(
    `${COGNITO_PREFIX_KEY}.${email?.value}.idToken`
  );

  if (!email || !token)
    return NextResponse.redirect(new URL('/entrar', request.url));

  console.log('TRES');

  const identityCredentials = await fromCognitoIdentityPool({
    clientConfig: { region: AWS_REGION },
    identityPoolId: COGNITO_IDENTITY_ID,
    logins: {
      [`cognito-idp.${AWS_REGION}.amazonaws.com/${COGNITO_USER_POOL_ID}`]:
        token.value,
    },
  })();

  console.log('QUATRO');

  const headers = new Headers();

  headers.set(
    'Set-Cookie',
    `${INDENTITY_KEY}=${encodeURIComponent(
      JSON.stringify(identityCredentials)
    )}; Expires=${new Date(
      Date.now() + 30 * 60 * 1000
    ).toUTCString()}; Path=/; SameSite=Lax; Secure; HttpOnly`
  );

  return NextResponse.redirect(new URL('/saltos', request.url), { headers });
}
