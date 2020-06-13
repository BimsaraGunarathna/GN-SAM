const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB({ region: 'ap-southeast-1', apiVersion: '2012-08-10'});

//thrid party libraries.
const ddbGeo = require('dynamodb-geo');

//Environment variables
const { BASE_TABLE_NAME, LOCATION_TABLE_NAME } = process.env;

exports.goNowHostVehicle = (event, context, callback) => {
        
    //geohash configuaration
    const config = new ddbGeo.GeoDataManagerConfiguration(dynamodb, LOCATION_TABLE_NAME);
    const myGeoTableManager = new ddbGeo.GeoDataManager(config);

    //eventually consistent reads, at half the cost
    config.consistentRead = false;
    //Use true([lon, lat]) for GeoJSON standard compliance. (default )
    config.longitudeFirst = true;
    //Dynamodb configuaration.
    config.geohashAttributeName = "LSI_01";
    config.hashKeyAttributeName = "PK";
    // Pick a hashKeyLength appropriate to your usage
    config.hashKeyLength = 6;
    config.rangeKeyAttributeName = "SK";
    config.geoJsonAttributeName = "geoJson";
    config.geohashIndexName = "LSI_LOCA_01";


    // Querying 100km from Cambridge, UK
    myGeoTableManager.queryRadius({
        RadiusInMeter: 100000,
        CenterPoint: {
            latitude: 51.51,
            longitude: -0.13
        }
    })
        // Print the results, an array of DynamoDB.AttributeMaps
        .then(
            (result) => {
                console.log('RESULT');
                console.log(result);
                if (result.length == 0) {

                    myGeoTableManager.putPoint({
                        RangeKeyValue: { S: '1234' }, // Use this to ensure uniqueness of the hash/range pairs.
                        GeoPoint: { // An object specifying latitutde and longitude as plain numbers. Used to build the geohash, the hashkey and geojson data
                            latitude: 51.51,
                            longitude: -0.13
                        },
                        PutItemInput: { // Passed through to the underlying DynamoDB.putItem request. TableName is filled in for you.
                            Item: { // The primary key, geohash and geojson data is filled in for you
                                country: { S: 'Old Empire' }, // Specify attribute values using { type: value } objects, like the DynamoDB API.
                                capital: { S: 'London' }
                            },
                            // ... Anything else to pass through to `putItem`, eg ConditionExpression
                        }
                    })
                        .promise()
                        .then(
                            console.log('Done! putting new point.')
                        )
                        .catch((err) => {
                            console.log('Error happened! Bit of fucked up at putting new point.')
                            console.log(err)
                        });

                } else {
                    myGeoTableManager.updatePoint({
                        RangeKeyValue: { S: '1234' },
                        GeoPoint: { // An object specifying latitutde and longitude as plain numbers.
                            latitude: 51.51,
                            longitude: -0.13
                        },
                        UpdateItemInput: { // TableName and Key are filled in for you
                            UpdateExpression: 'SET country = :newName',
                            ExpressionAttributeValues: {
                                ':newName': { S: 'God bless the Queen' }
                            }
                        }
                    })
                        .promise()
                        .then(() => { console.log('Done! updatting exsiting point.') })
                        .catch(() => { console.log('Error happened! updatting exsiting point.') });
                }

            }

        )
        .then( () => {
            console.log('Done! query found matching Geo Hash.')
        })
        .catch(
            (err) => {
                console.log('Error happened! Geo Hash query failed.');
                console.log(err);
            }
        );

    //Putting a new vehicle record to the Base table.    
    var newVehicleId = 'vehicleId_' + (Math.random());
    const params = {
        Item: {
            "vehicleId": {
                S: newVehicleId
            },
            "hostId": { 
                S: event.hostId
            },
            "hostName": { 
                S: event.hostName
            },
            "hostPhoneNumber": { 
                S: event.hostPhoneNumber
            },
            "vehicleName": { 
                S: event.vehicleName
            },
            "vehicleType": { 
                S: event.vehicleType
            },
            "vehicleNumOfSeats": { 
                S: event.vehicleNumOfSeats
            },
            "vehicleKmPerL": { 
                N: event.vehicleKmPerL
            },
            "vehicleDayPrice": { 
                N: event.vehicleDayPrice
            },
            "vehiclePickupLocation": { 
                S: event.vehiclePickupLocation
            },
            "vehicleReturnLocation": {
                S: event.vehicleReturnLocation
            },
            "vehicleAvaliableStartDate": {
                S: event.vehicleAvaliableStartDate
            },
            "vehicleAvaliableEndDate": {
                S: event.vehicleAvaliableEndDate
            },
            "vehicleDescription": {
                S: event.vehicleDescription
            },
            "vehicleRegNumber": {
                S: event.vehicleRegNumber
            },
            "isVehicleFavourite": {
                BOOL: event.isVehicleFavourite
            },
            "vehicleTag1": {
                S: event.vehicleTag1
            },
            "vehicleTag2": {
                S: event.vehicleTag2
            },
            "vehicleTag3": {
                S: event.vehicleTag3
            },
            "vehicleProfileImageUrl": {
                S: event.vehicleProfileImageUrl
            },
            "vehicleImageUrl1": {
                S: event.vehicleImageUrl1
            },
            "vehicleImageUrl2": {
                S: event.vehicleImageUrl2
            },
            "vehicleImageUrl3": {
                S: event.vehicleImageUrl3
            },
            "vehicleAvailability": {
                BOOL: event.vehicleAvailability
            },
            "vehicleTripId": {
                S: event.vehicleTripId
            }
        },
        TableName: BASE_TABLE_NAME
    };
    dynamodb.putItem(params, function(err, data) {
        if (err) {
            console.log(err);
            callback(err);
        } else {
            console.log(data);
            callback(null, newVehicleId);
        }
    });
    
};
