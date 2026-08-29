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

### 3. Install Dependencies

Make sure you have `Node.js`(22.0.0) installed. Then, run:

```bash
npm install
```

### 4. Set Up the Environment Variables

Create a `.env` file in the root directory and configure the required environment variables. For example:

```env
PORT=3000
```

### 5. Start the Application

Run the application using:

```bash
npm run start
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

### Request to Track the Shipment for the Order

```bash
curl --location --request GET 'http://localhost:3000/api/v1/orders/123/track' \
--header 'Content-Type: application/json' \
--data '{
    "courier_partner": "URBANE_BOLT"
}'
```

### Request to Cancel the Shipment for the Order

```bash
curl --location 'http://localhost:3000/api/v1/orders/123/cancel' \
--header 'Content-Type: application/json' \
--data '{
    "courier_partner": "URBANE_BOLT"
}'
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

---

Challenges:

1. In order to call urbanebolt api we need to have the access token inside the request header so to avoid keep fetching the access token from the urbanbolt api we are implementing the redis so that we can store the access token inside it and we can make use of the token while making request for that we will keep all the logic inside the request interceptor.

Worklfow:

We are taking only neccessary data for the implementation like order id, courier_partner, customer_code

but most of the details we are generating dummy although we can expect in the request payload from the client but to keep things simple we need only these details for now and can generate all the info required for the urbolt api on the fly. like return details, seller details, customer details, and product details.

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
