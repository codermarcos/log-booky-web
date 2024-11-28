import { CognitoIdentityCredentialProvider } from "@aws-sdk/credential-providers";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export const TableNames = {
  JUMP: process.env.DYNAMO_TABLE_JUMPS,
};

export function getDocumentClient(
  credentials: Awaited<ReturnType<CognitoIdentityCredentialProvider>>
) {
  const client = new DynamoDBClient({
    credentials,
  });

  const document = DynamoDBDocumentClient.from(client);

  return { client, document };
}
