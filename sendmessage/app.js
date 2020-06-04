// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10', region: process.env.AWS_REGION });

const { TABLE_NAME } = process.env;

var moment = require("moment-timezone");

exports.sendMessage = async event => {

  //body of the request.
  var body = JSON.parse(event.body);

  //get the user id of the new connection holder.
  var receiverId = body.receiverId;

  //ID of sender.
  var senderId = body.senderId;

  //get the msg content.
  var msgText = body.messageText;

  //var createdAt = moment(date.getTime()).tz("Asia/Colombo").utc().format();
  var createdAt = new Date();

  //message seen status.
  var msgSeen = false;

  //Post message.
  var putParamsForReceiverTable = {
    TableName: TABLE_NAME,
    Item: {
      PK: "RECEIVER#" + receiverId,
      SK: "RECEIVER#" + msgSeen + "#" + createdAt,
      msgSeen: msgSeen,
      createdAt: "" + createdAt,
      receiverId: receiverId,
      senderId: senderId,
      msgText: msgText
    }
  };

  //Get active connection data for receiverId
  var getConnectionIdByConnectionUserId = {
    TableName: TABLE_NAME,
    IndexName: 'GSI_1',
    KeyConditionExpression: '#pk = :pk',
    ExpressionAttributeNames: {
      '#pk': "connectionUserId",
    },
    ExpressionAttributeValues: {
      ":pk": receiverId,
    },
    ProjectionExpression: 'connectionId'
  }

  let connectionData;

  //put the message to the RECEIVER table
  try {
    await ddb.put(putParamsForReceiverTable).promise();
    //connectionData = await ddb.scan({ TableName: TABLE_NAME, ProjectionExpression: 'PK' }).promise();
    //messages = await ddb.query(getParamsForReceiverTable).promise();
  } catch (e) {
    return {statusCode: 500, body: 'Failed to put the msg to Receiver table : ' + JSON.stringify(e.stack)};
  }

  //get the connection data.
  try {
    connectionData = await ddb.query(getConnectionIdByConnectionUserId).promise();
  } catch (e) {
    return {statusCode: 500, body: 'Failed to get the connection data from Connection table : ' + JSON.stringify(e.stack)};
  }

  const apigwManagementApi = new AWS.ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    endpoint: event.requestContext.domainName + '/' + event.requestContext.stage
  });

  const postCalls = connectionData.Items.map(async (item) => {
    try {
      await apigwManagementApi.postToConnection({ ConnectionId: item['connectionId'], Data: msgText }).promise();
    } catch (e) {
      if (e.statusCode === 410) {
        console.log(`Found stale connection, deleting ${connectionId}`);
        await ddb.delete({ TableName: TABLE_NAME, Key: { PK: "CONNECTION#" + item['connectionId'] } }).promise();
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
  /*
  //dynamodb scan
  let connectionData;

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
  //var mom = moment(date.getTime()).tz("Asia/Colombo").format("DD-MM-YYYY, H:mm:ss a");
  var msgCreatedAt = moment(date.getTime()).tz("Asia/Colombo").utc().format();
  connectionData = await ddb.scan({ TableName: TABLE_NAME, ProjectionExpression: 'connectionId' }).promise();

  //scan dynamodb
  params = {
    ExpressionAttributeNames: {
      "#AT": "userId"
    },
    ExpressionAttributeValues: {
      ":a": {
        S: userId
      }
    },
    FilterExpression: "userId = :a",
    ProjectionExpression: "#AT",
    TableName: TABLE_NAME,
    Limit: 100
  };
  dynamodb.scan(params, function (err, data) {
    if (err) {
      console.log(err);
      callback(err);
    } else {
      if (data != null && data.length == 1) {
        receiverConnectionId = data.items[0].connectionId;
        result
      }
      console.log(items);
      callback(null, items);
    }
  });



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
  */
};
