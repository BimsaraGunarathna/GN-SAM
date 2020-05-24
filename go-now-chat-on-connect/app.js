// const axios = require('axios')
// const url = 'http://checkip.amazonaws.com/';
let response;

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */
const AWS = require('aws-sdk');
//const dynamodb = new AWS.DynamoDB({ region: 'ap-south-1', apiVersion: '2012-08-10' });
const ddb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10', region: 'ap-south-1' });

exports.goNowChatOnConnect = async (event, context, callback) => {
    const putParams = {
        TableName: 'gn-chat-table',
        Item: {
            connectionId: event.requestContext.connectionId
        }
    };

    try {
        await ddb.put(putParams).promise();
    } catch (err) {
        return { statusCode: 500, body: 'Failed to connect: ' + JSON.stringify(err) };
    }

    return { statusCode: 200, body: 'Connected.' };
};
