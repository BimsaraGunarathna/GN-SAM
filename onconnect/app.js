// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10', region: process.env.AWS_REGION });

exports.onConnect = async event => {

  //get webscoket conncetion id.
  const connectionId = event.requestContext.connectionId;
  //get the user id of the new connection holder.
  const connectionUserId = event.queryStringParameters.connectionUserId;

  //Parameters to add record to the Connection table.
  const putParamsForConnectionTable = {
    TableName: process.env.TABLE_NAME,
    Item: {
      PK: "CONNECTION#" + connectionId,
      SK: "CONNECTION#" + connectionUserId,
      connectionId: connectionId,
      connectionUserId: connectionUserId
    }
  };

  try {
    //add the record to the Connection table.
    await ddb.put(putParamsForConnectionTable).promise();
  } catch (err) {
    return { statusCode: 500, body: 'Failed to connect(record creation failed ): ' + JSON.stringify(err) };
  }

  return { statusCode: 200, body: 'Connected.' };
  /*

  //get webscoket conncetion id.
  const connectionId = event.requestContext.connectionId;
  //get the user id of the new connection holder.
  const connectionUserId = event.queryStringParameters.connectionUserId;

  const connectionPutParams = {
    TableName: process.env.TABLE_NAME,
    Item: {
      conncetionUserId: connectionUserId,
      connectionId: connectionId
    }
  };

  const messageGetParams = {
    TableName: process.env.TABLE_NAME,
    ExpressionAttributeNames: {
      "#AT": "receiverId"
    },
    ExpressionAttributeValues: {
      ":a": {
        S: conncetionUserId
      }
    },
    FilterExpression: "conncetionUserId = :a",
    ProjectionExpression: "#AT",
    Limit: 100
  };

  try {
    await ddb.put(connectionPutParams).promise();
    messageData = await ddb.scan(messageGetParams).promise();
  } catch (err) {
    return { statusCode: 500, body: 'Failed to connect: ' + JSON.stringify(err) };
  }

  return { statusCode: 200, body: messageData };
  */
};
