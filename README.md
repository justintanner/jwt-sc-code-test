# Justin Tanner's code test for ScreenCloud

![Tests](https://github.com/justintanner/jwt-sc-code-test/actions/workflows/test.yml/badge.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This was a fun code test, I learned about Prisma and was impressed with big.js.

### Prerequisites

* [Node.js](https://nodejs.org/en/)

### Local Setup

1. Clone the repository
2. Run `npm install`
3. Seed the local database with `npm run seed`
4. Start the server with `npm start`

After you start the server you can query all the devices with:

```
curl http://localhost:3000/devices
```

To check an order with a specific device id you can run a query like:

```
curl -X POST -H "Content-Type: application/json" -d '{"deviceId": 1, "quantity": 4, "lat": "40.639722", "lng": "-73.1"}' http://localhost:3000/ship
```

If that order looks good you can save it to the database with the `saveOrder` parameter.

```
curl -X POST -H "Content-Type: application/json" -d '{"deviceId": 1, "quantity": 4, "lat": "40.639722", "lng": "-73.1", "saveOrder": "true"}' http://localhost:3000/ship
```
### API Documentation

#### GET /devices
Returns all available devices in inventory

#### POST /ship
Calculate shipping costs and optionally save order

Request Body:

```json
{
  "deviceId": number,
  "quantity": number,
  "lat": string,
  "lng": string,
  "saveOrder": boolean  
}
```

### Running the Test

```
npm test
```
