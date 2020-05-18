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
const dynamodb = new AWS.DynamoDB({ region: 'ap-south-1', apiVersion: '2012-08-10' });

exports.goNowGetPublicVehicleList = async (event, context, callback) => {
    console.log('API Gateway PARAMETERS');
    console.log(event.params.type);
    const page = event.page;
    const type = event.type;
    var params = {};

    switch (type) {
        case 'all':
            params = {
                TableName: "gn-vehicle",
                Limit: 20
            };
            dynamodb.scan(params, function (err, data) {
                if (err) {
                    console.log(err);
                    callback(err);
                } else {
                    const items = data.Items.map(
                        (dataField) => {
                            return {
                                vehicleId: dataField.vehicleId.S,
                                hostId: dataField.hostId.S,
                                hostName: dataField.hostName.S,
                                hostPhoneNumber: dataField.hostPhoneNumber.S,
                                vehicleName: dataField.vehicleName.S,
                                vehicleType: dataField.vehicleType.S,
                                vehicleNumOfSeats: dataField.vehicleNumOfSeats.S,
                                vehicleKmPerL: dataField.vehicleKmPerL.N,
                                vehicleDayPrice: dataField.vehicleDayPrice.N,
                                vehiclePickupLocation: dataField.vehiclePickupLocation.S,
                                vehicleReturnLocation: dataField.vehicleReturnLocation.S,
                                vehicleAvaliableStartDate: dataField.vehicleAvaliableStartDate.S,
                                vehicleAvaliableEndDate: dataField.vehicleAvaliableEndDate.S,
                                vehicleDescription: dataField.vehicleDescription.S,
                                vehicleRegNumber: dataField.vehicleRegNumber.S,
                                isVehicleFavourite: dataField.isVehicleFavourite.BOOL,
                                vehicleTag1: dataField.vehicleTag1.S,
                                vehicleTag2: dataField.vehicleTag2.S,
                                vehicleTag3: dataField.vehicleTag3.S,
                                vehicleProfileImageUrl: dataField.vehicleProfileImageUrl.S,
                                vehicleImageUrl1: dataField.vehicleImageUrl1.S,
                                vehicleImageUrl2: dataField.vehicleImageUrl2.S,
                                vehicleImageUrl3: dataField.vehicleImageUrl3.S,
                                vehicleAvailability: dataField.vehicleAvailability.BOOL,
                                vehicleTripId: dataField.vehicleTripId.S,
                            }
                        }
                    );
                    console.log(items);
                    callback(null, items);
                }
            });

            break;
        case 'host':
            params = {
                TableName: "gn-vehicle",
                Limit: 30
            };
            dynamodb.scan(params, function (err, data) {
                if (err) {
                    console.log(err);
                    callback(err);
                } else {
                    const items = data.Items.map(
                        (dataField) => {
                            if (dataField.hostId.S == type) {
                                return {
                                    vehicleId: dataField.vehicleId.S,
                                    hostId: dataField.hostId.S,
                                    hostName: dataField.hostName.S,
                                    hostPhoneNumber: dataField.hostPhoneNumber.S,
                                    vehicleName: dataField.vehicleName.S,
                                    vehicleType: dataField.vehicleType.S,
                                    vehicleNumOfSeats: dataField.vehicleNumOfSeats.S,
                                    vehicleKmPerL: dataField.vehicleKmPerL.N,
                                    vehicleDayPrice: dataField.vehicleDayPrice.N,
                                    vehiclePickupLocation: dataField.vehiclePickupLocation.S,
                                    vehicleReturnLocation: dataField.vehicleReturnLocation.S,
                                    vehicleAvaliableStartDate: dataField.vehicleAvaliableStartDate.S,
                                    vehicleAvaliableEndDate: dataField.vehicleAvaliableEndDate.S,
                                    vehicleDescription: dataField.vehicleDescription.S,
                                    vehicleRegNumber: dataField.vehicleRegNumber.S,
                                    isVehicleFavourite: dataField.isVehicleFavourite.BOOL,
                                    vehicleTag1: dataField.vehicleTag1.S,
                                    vehicleTag2: dataField.vehicleTag2.S,
                                    vehicleTag3: dataField.vehicleTag3.S,
                                    vehicleProfileImageUrl: dataField.vehicleProfileImageUrl.S,
                                    vehicleImageUrl1: dataField.vehicleImageUrl1.S,
                                    vehicleImageUrl2: dataField.vehicleImageUrl2.S,
                                    vehicleImageUrl3: dataField.vehicleImageUrl3.S,
                                    vehicleAvailability: dataField.vehicleAvailability.BOOL,
                                    vehicleTripId: dataField.vehicleTripId.S,
                                };
                            }
                        }
                    );
                    console.log(items);
                    callback(null, items);
                }
            });
            break;

        default:
            //callback(null, 'Something went wrong');
            params = {
                TableName: "gn-vehicle",
                Limit: 20
            };
            dynamodb.scan(params, function (err, data) {
                if (err) {
                    console.log(err);
                    callback(err);
                } else {
                    const items = data.Items.map(
                        (dataField) => {
                            return {
                                vehicleId: dataField.vehicleId.S,
                                hostId: dataField.hostId.S,
                                hostName: dataField.hostName.S,
                                hostPhoneNumber: dataField.hostPhoneNumber.S,
                                vehicleName: dataField.vehicleName.S,
                                vehicleType: dataField.vehicleType.S,
                                vehicleNumOfSeats: dataField.vehicleNumOfSeats.S,
                                vehicleKmPerL: dataField.vehicleKmPerL.N,
                                vehicleDayPrice: dataField.vehicleDayPrice.N,
                                vehiclePickupLocation: dataField.vehiclePickupLocation.S,
                                vehicleReturnLocation: dataField.vehicleReturnLocation.S,
                                vehicleAvaliableStartDate: dataField.vehicleAvaliableStartDate.S,
                                vehicleAvaliableEndDate: dataField.vehicleAvaliableEndDate.S,
                                vehicleDescription: dataField.vehicleDescription.S,
                                vehicleRegNumber: dataField.vehicleRegNumber.S,
                                isVehicleFavourite: dataField.isVehicleFavourite.BOOL,
                                vehicleTag1: dataField.vehicleTag1.S,
                                vehicleTag2: dataField.vehicleTag2.S,
                                vehicleTag3: dataField.vehicleTag3.S,
                                vehicleProfileImageUrl: dataField.vehicleProfileImageUrl.S,
                                vehicleImageUrl1: dataField.vehicleImageUrl1.S,
                                vehicleImageUrl2: dataField.vehicleImageUrl2.S,
                                vehicleImageUrl3: dataField.vehicleImageUrl3.S,
                                vehicleAvailability: dataField.vehicleAvailability.BOOL,
                                vehicleTripId: dataField.vehicleTripId.S
                            }
                        }
                    );
                    console.log(items);
                    callback(null, items);
                }
            });
    }
};
