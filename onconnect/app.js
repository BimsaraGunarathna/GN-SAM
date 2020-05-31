// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10', region: process.env.AWS_REGION });

exports.onConnect = async event => {

  //get webscoket conncetion id.
  const connectionId = event.requestContext.connectionId;
  //get the user id of the new connection holder.
  const userId = event.queryStringParameters.userId;

  const putParams = {
    TableName: process.env.TABLE_NAME,
    Item: {
      connectionId: connectionId,
      userId: userId
    }
  };

  try {
    await ddb.put(putParams).promise();
  } catch (err) {
    return { statusCode: 500, body: 'Failed to connect: ' + JSON.stringify(err) };
  }

  return { statusCode: 200, body: 'Connection is successfully established.' };
};
