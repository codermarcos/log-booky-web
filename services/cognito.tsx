import * as AmazonCognitoIdentity from "amazon-cognito-identity-js";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";

import { promisify } from "util";

import callback from "@/helpers/promisify";

import CookieStorage from "@/services/cookie";

const AWS_REGION = process.env.NEXT_PUBLIC_AWS_REGION as string;
const COGNITO_USER_POOL_CLIENT_ID = process.env
  .NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID as string;
const COGNITO_IDENTITY_ID = process.env
  .NEXT_PUBLIC_COGNITO_IDENTITY_ID as string;
const COGNITO_USER_POOL_ID = process.env
  .NEXT_PUBLIC_COGNITO_USER_POOL_ID as string;

export type ILogin = AmazonCognitoIdentity.IAuthenticationDetailsData;
export type ICognitoUserPoolData = AmazonCognitoIdentity.ICognitoUserPoolData;

const getOptions = (cookie?: string): ICognitoUserPoolData => ({
  ClientId: COGNITO_USER_POOL_CLIENT_ID,
  Storage: new CookieStorage(cookie),
  UserPoolId: COGNITO_USER_POOL_ID,
});

const cognito = new AmazonCognitoIdentity.CognitoUserPool(getOptions());

const getUser = (cookie?: string) => {
  const userPool =
    typeof cookie === "string"
      ? new AmazonCognitoIdentity.CognitoUserPool(getOptions(cookie))
      : cognito;

  const user = userPool.getCurrentUser();

  if (user === null) throw new Error("no user");

  return {
    ...user,
    getAttributes: promisify(user.getUserAttributes),
    getSession: promisify(user.getSession),
  };
};

const getCredentialsFromIdentity = async (
  session: AmazonCognitoIdentity.CognitoUserSession
) => {
  const cognitoIdentityPool = await fromCognitoIdentityPool({
    clientConfig: { region: AWS_REGION },
    identityPoolId: COGNITO_IDENTITY_ID,
    logins: {
      [`cognito-idp.${AWS_REGION}.amazonaws.com/${COGNITO_USER_POOL_ID}`]:
        session.getIdToken().getJwtToken(),
    },
  })();

  return cognitoIdentityPool;
};

const signIn = (auth: ILogin) =>
  new Promise<AmazonCognitoIdentity.CognitoUserSession>(
    (onSuccess, onFailure) => {
      const details = new AmazonCognitoIdentity.AuthenticationDetails(auth);

      const user = new AmazonCognitoIdentity.CognitoUser({
        Pool: cognito,
        Storage: new CookieStorage(),
        Username: auth.Username,
      });

      user.authenticateUser(details, {
        onFailure,
        onSuccess,
      });
    }
  );

const signUp = ({ email, password }: Record<"email" | "password", string>) =>
  new Promise((resolve, reject) => {
    const attributes = [
      new AmazonCognitoIdentity.CognitoUserAttribute({
        Name: "email",
        Value: email,
      }),
    ];

    cognito.signUp(
      email,
      password,
      attributes,
      attributes,
      callback(resolve, reject)
    );
  });

const confirmUser = ({ Username, code }: { Username: string; code: string }) =>
  new Promise((resolve, reject) => {
    const user = new AmazonCognitoIdentity.CognitoUser({
      Pool: cognito,
      Username,
    });

    user.confirmRegistration(code, false, callback(resolve, reject));
  });

const confirmReset = ({
  Username,
  code,
  password,
}: {
  Username: string;
  code: string;
  password: string;
}) =>
  new Promise((onSuccess, onFailure) => {
    const user = new AmazonCognitoIdentity.CognitoUser({
      Pool: cognito,
      Username,
    });

    user.confirmPassword(code, password, { onSuccess, onFailure });
  });

export {
  cognito,
  confirmUser,
  confirmReset,
  signIn,
  signUp,
  getUser,
  getCredentialsFromIdentity,
};
