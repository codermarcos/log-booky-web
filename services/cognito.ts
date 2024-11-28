export const AWS_REGION = process.env.NEXT_PUBLIC_AWS_REGION!;
export const COGNITO_IDENTITY_ID = process.env.NEXT_PUBLIC_COGNITO_IDENTITY_ID!;
export const COGNITO_USER_POOL_ID =
  process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!;
export const COGNITO_USER_POOL_CLIENT_ID =
  process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID!;

export const COGNITO_PREFIX_KEY = `CognitoIdentityServiceProvider.${COGNITO_USER_POOL_CLIENT_ID}`;
export const INDENTITY_KEY = `${COGNITO_PREFIX_KEY}.IdentityCredentials`;
export const SUB_KEY = `${COGNITO_PREFIX_KEY}.Sub`;
