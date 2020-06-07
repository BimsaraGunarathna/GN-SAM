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
const dynamodb = new AWS.DynamoDB({region: 'ap-south-1', apiVersion: '2012-08-10'});

exports.goNowDeleteWishlistItem = async (event, context, callback) => {
    const params = {
        Key: {
            "vehicleId": {
                S: event.vehicleId
            }
        },
        TableName: "gn-vehicle"
    };

    dynamodb.deleteItem(params, function (err, data) {
        if (err) {
            console.log(err, err.stack);
            callback(err);
        }
        else {
            console.log(data);
            callback(null, data);
        }

    });
};
