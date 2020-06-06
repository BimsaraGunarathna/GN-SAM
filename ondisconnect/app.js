// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

// https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-websocket-api-route-keys-connect-disconnect.html
// The $disconnect route is executed after the connection is closed.
// The connection can be closed by the server or by the client. As the connection is already closed when it is executed, 
// $disconnect is a best-effort event. 
// API Gateway will try its best to deliver the $disconnect event to your integration, but it cannot guarantee delivery.

const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10', region: process.env.AWS_REGION });

exports.onDisconnect = async event => {
  //get the user id of the new connection holder.
  const connectionId = event.requestContext.connectionId;

  //for query
  const paramsForQueryConnection = {
    TableName: "GoNowChatTable",
    //KeyConditionExpression: '#pk = :pk',
    KeyConditionExpression: '#pk = :pk AND begins_with(#sk, :sk)',
    ExpressionAttributeNames: {
      '#pk': "PK",
      '#sk': "SK"
    },
    ExpressionAttributeValues: {
      ":pk": "CONNECTION#" + connectionId,
      ":sk": "CONNECTION#"
    },
    ProjectionExpression: 'PK, SK'  
  }
  
  //get the primary key for the CONNECTION record.
  try {
    var primaryKeyQueryForConnection = await (ddb.query(paramsForQueryConnection).promise());
    var primaryKeyForConnection = await primaryKeyQueryForConnection['Items'][0];
  } catch (err) {
    return { statusCode: 500, body: 'Failed to query for disconnect: ' + JSON.stringify(err) };
  }

  //for delete
  const paramsForDeleteConnection = {
    TableName: process.env.TABLE_NAME,
    Key: primaryKeyForConnection
  };

  //delete the retrieved CONNECTION record.
  try {
    await ddb.delete(paramsForDeleteConnection).promise();
  } catch (err) {
    return { statusCode: 500, body: 'Failed to delete for disconnect: ' + JSON.stringify(err) };
  }

  return { statusCode: 200, body: 'Disconnected.' };
};
