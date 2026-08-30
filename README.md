# Backend Assignment (courier-integration-service)

## Problem Statement:

We need to design the courier integration system. In our system, we can onboard a few couriers like UrbaneBolt, Shiprocket, and Delhivery.

---

## Stack Used:

- **Language**: JavaScript
- **Environment**: Node.js
- **Frameworks**: Express
- **ORMs**: Prisma
- **Databases**: MySQL(Shipment details) and MongoDB(to track the req and resp of Courier)
- **Other Tools**: Docker

---

## Steps to Set Up the Project

Follow these steps to set up and run the project locally:

### 1. Clone the Repository

```bash
git clone git@github.com:surendra-pal-uikey/courier-integration-service.git
```

### 2. Navigate to the Project Directory

```bash
cd courier-integration-service
```

### 3. Set Up the Environment Variables

Create a `.env` file in the root directory and configure the required environment variables as given in the .env.example.

### 4. Tools or software needed to run the application
VSCode, Docker, Node(22.20.0), Postman for testing the application.

### 5. Start the Application

We have dockerized the entire application. We have to run this command to run the application:

In the Docker setup, we have these services on the same network:

1. Node application
2. MongoDB
3. MYSQL DB
4. REDIS
   
```bash
docker compose up -d
```

The application will start on `http://localhost:3000`.

---

## API Endpoints

### Request to Create the Shipment for the Order

```bash
curl --location 'http://localhost:3000/api/v1/orders/' \
--header 'Content-Type: application/json' \
--data '{
    "courier_partner": "URBANE_BOLT",
    "order_id": "UATTESTUEBCUS0018",
    "customer_code": "UEBCUS0008"
}'
```

Response:
```json
{
   "success": true,
   "data": {
     orderId: 'UEBCUS00015',
     courierPartnerUsed: 'URBANE_BOLT',
     courierShipmentId: '1',
     awbNumber: '200000001170',
     currentShipmentStatus: 'CANCELLED',
     createdAt: 2026-08-30T06:21:32.000Z,
   }
}
```

### Request to Track the Shipment for the Order

```bash
curl --location --request GET 'http://localhost:3000/api/v1/orders/123/track' \
--header 'Content-Type: application/json' \
--data '{
    "courier_partner": "URBANE_BOLT"
}'
```

Response:
```json
{
    "success": true,
    "data": {
        "orderId": "UEBCUS00015",
        "awbNumber": 200000001170,
        "status": "CANCELLED",
        "updateAt": "03 May 2025, 15:47"
    }
}
```

### Request to Cancel the Shipment for the Order

```bash
curl --location 'http://localhost:3000/api/v1/orders/123/cancel' \
--header 'Content-Type: application/json' \
--data '{
    "courier_partner": "URBANE_BOLT"
}'
```

```json
{
    "success": true,
    "data": {
        "status": "Success",
        "message": "Cancellation Process",
        "successResponse": [],
        "failureResponse": [
            {
                "orderNumber": "UEBCUS00015",
                "awb": "200000001170",
                "message": "Shipment already cancelled!"
            }
        ]
    }
}
```
### Request to Place Bulk Shipments for the Orders

```bash
curl --location 'http://localhost:3000/api/v1/orders/bulk' \
--header 'Content-Type: application/json' \
--data '[
    {
        "courier_partner": "URBANE_BOLT",
        "order_id": "UATTESTUEBCUS0018",
        "customer_code": "UEBCUS0008"
    }
]'
```
Response:
```json
{
   "success": true,
   "data": [
      {
        orderId: 'UEBCUS00015',
        courierPartnerUsed: 'URBANE_BOLT',
        courierShipmentId: '1',
        awbNumber: '200000001170',
        currentShipmentStatus: 'CANCELLED',
        createdAt: 2026-08-30T06:21:32.000Z,
      }
   ]
}
```
---

Challenges:

1. To call urbanebolt api, we need to have the access token in the request header. To avoid repeatedly fetching the access token from the urbanbolt api, we are implementing Redis so that we can store the access token in it and make use of the token while making requests; for that, we will keep all the logic inside the request interceptor.
2. Bulk processing request: we have used the p-limit package to process the 10 requests in parallel.
   The current setup is not working correctly due to the incorrect customerCode and orderNumber. I have implemented this simple solution using the p-limit package.    In the product, we can make use of the event-driven architecture for a better app experience; we have two options: RabbitMQ and Kafka. We will take the     bulk request and then assign the batch ID to that request, and then process it in the backend; all the requests are in the backend, and we can expose one special endpoint where the user just needs to provide the batch id and we will give back all the details about the bulk request in that particular request.
   
4. Race condition for authentication in case of bulk requests: we will make use of the async-mutex lib.

Workflow:

We are taking only the necessary data for the implementation, like order id, courier_partner, customer_code

but most of the details we are generating dummy although we can expect them in the request payload from the client; to keep things simple, we need only these details for now and can generate all the info required for the urbolt api on the fly. Like return details, seller details, customer details, and product details.

Architecture Diagram:
<img width="1775" height="788" alt="Screenshot 2026-08-29 at 11 01 16 PM" src="https://github.com/user-attachments/assets/2651cb3b-8ade-46fd-b834-9e4aa6d7b289" />

## Example Create Shipment Request

```json
[
  {
    "customerCode": "UEBCUS0008",
    "orderNumber": "UATTESTUEBCUS0018",
    "declaredValue": 100,
    "itemDescription": "BOOKS",
    "collectableValue": 1,
    "height": 10,
    "length": 12,
    "pieces": 1,
    "weight": 1.1,
    "breadth": 10,
    "serviceType": "SDD",
    "payMode": "COD",
    "rtnCity": "Govindpura",
    "rtnName": "Rohit Athaley",
    "consCity": "Surat",
    "consName": "Satyam Convent School",
    "rtnEmail": "bhopal@mbdgroup.com",
    "rtnState": "BHOPAL",
    "shprCity": "Govindpura",
    "shprName": "Rohit Athaley",
    "consEmail": "TEST2@AIL.COM",
    "consState": "GUJRAT",
    "rtnMobile": 9425018023,
    "shprEmail": "bhopal@mbdgroup.com",
    "shprState": "BHOPAL",
    "consMobile": 8320226438,
    "rtnAddress": "HOLY FAITH INTERNATIONAL P LTD,Plot No.l37-138-139 Sector-I Spl.Industrial Area Govindpura",
    "rtnAddressType": "Seller",
    "rtnCountry": "INDIA",
    "rtnPincode": 122017,
    "shprMobile": 9425018023,
    "consAddress": "Plot No. 26-27, Om Nagar Society,Sumbhal, Surat (Deepak Sir)",
    "consAddressType": "Home",
    "consCountry": "INDIA",
    "consPincode": 122001,
    "invoiceNumber": "INV0002",
    "invoiceDate": "2024-10-02",
    "shprAddress": "HOLY FAITH INTERNATIONAL P LTD,Plot No.l37-138-139 Sector-I Spl.Industrial Area Govindpura",
    "shprAddressType": "Seller",
    "shprCountry": "INDIA",
    "shprPincode": 122001,
    "invoiceValue": 10,
    "itemQuantity": 1
  }
]
```
