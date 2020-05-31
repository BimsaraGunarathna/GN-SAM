// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10', region: process.env.AWS_REGION });

const { TABLE_NAME } = process.env;

var moment = require("moment-timezone");

exports.sendMessage = async event => {

  //get webscoket conncetion id.
  const connectionId = event.requestContext.connectionId;
  //get the user id of the new connection holder.
  const userId = event.queryStringParameters.userId;
  //get the request body
  const body = JSON.parse(event.body);

  //Message text.
  const msg = body.message;
  //ReceiverId
  const receiverId = body.receiverId;

  //get the current time
  var date = new Date();
  var mom = moment(date.getTime()).tz("Asia/Colombo").format("DD-MM-YYYY, H:mm:ss a");

  var date1 = Date.now();
  callback(null, mom + '   ' + date1 + '   ' + date1);

  console.log('- Event of the sendmessage -');
  console.log(event);

  let connectionData;
  
  try {
    connectionData = await ddb.scan({ TableName: TABLE_NAME, ProjectionExpression: 'connectionId' }).promise();
  } catch (e) {
    return { statusCode: 500, body: e.stack };
  }
  
  const apigwManagementApi = new AWS.ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    endpoint: event.requestContext.domainName + '/' + event.requestContext.stage
  });
  
  const postData = JSON.parse(event.body).data;
  
  const postCalls = connectionData.Items.map(async ({ connectionId }) => {
    try {
      await apigwManagementApi.postToConnection({ ConnectionId: connectionId, Data: postData }).promise();
    } catch (e) {
      if (e.statusCode === 410) {
        console.log(`Found stale connection, deleting ${connectionId}`);
        await ddb.delete({ TableName: TABLE_NAME, Key: { connectionId } }).promise();
      } else {
        throw e;
      }
    }
  });
  
  try {
    await Promise.all(postCalls);
  } catch (e) {
    return { statusCode: 500, body: e.stack };
  }

  return { statusCode: 200, body: 'Data sent.' };
};
