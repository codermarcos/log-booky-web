import { QueryCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { type NextRequest } from 'next/server';
import { randomUUID } from 'crypto';

import { TableNames, getDocumentClient } from '@/services/dynamodb';
import { INDENTITY_KEY, SUB_KEY } from '@/services/cognito';

export async function GET(request: NextRequest) {
  const identity = request.cookies.get(INDENTITY_KEY);
  const sub = request.cookies.get(SUB_KEY);

  if (!sub || !identity) return new Response('unathorized', { status: 403 });

  const credentials = JSON.parse(identity.value);

  const { document } = getDocumentClient({
    ...credentials,
    expiration: new Date(credentials.expiration),
  });

  const command = new QueryCommand({
    TableName: TableNames.JUMP,
    ConsistentRead: true,
    ExpressionAttributeValues: {
      ':sk': `USER#${sub}`,
    },
    KeyConditionExpression: 'sourceKey = :sk',
  });

  const response = await document.send(command);

  return new Response(JSON.stringify(response.Items), {
    status: 200,
  });
}

export async function POST(
  request: NextRequest,
  {}: { params: Promise<{ slug: string }> }
) {
  const identity = request.cookies.get(INDENTITY_KEY);
  const sub = request.cookies.get(SUB_KEY);

  if (!sub || !identity) return new Response('unathorized', { status: 403 });

  const kindKey = randomUUID().toString();

  const { document } = getDocumentClient(JSON.parse(identity.value));

  const command = new PutCommand({
    TableName: TableNames.JUMP,
    Item: {
      sourceKey: `USER#${sub}`,
      kindKey: `JUMP#${kindKey}`,
    },
  });

  await document.send(command);

  return new Response(JSON.stringify(kindKey), {
    status: 200,
  });
}
