# Backend Assignment(courier-integration-service)

Problem Statement:
We need to design the courier integration system. In our system, we can onboard a few couriers like UrbaneBolt, Shiprocket, and Delhivery.

## Stack Used:

Language: JS
Environment: Node
Frameworks: Express
ORMs: Prisma
Databases: MySQL
Other Tools: Docker, Redis.

## API endpoints

### Request to create the shipment for the order

```bash
curl --location 'http://localhost:3000/api/v1/orders/' \
--header 'Content-Type: application/json' \
--data '{
    "courier_partner": "URBANE_BOLT",
    "order_id": "UATTESTUEBCUS0018",
    "customer_code": "UEBCUS0008"
}'
```

### Request to track the shipment for the order

```bash
curl --location --request GET 'http://localhost:3000/api/v1/orders/123/track' \
--header 'Content-Type: application/json' \
--data '{
    "courier_partner": "URBANE_BOLT"
}'
```

### Request to cancel the shipment for the order

```bash
curl --location 'http://localhost:3000/api/v1/orders/123/cancel' \
--header 'Content-Type: application/json' \
--data '{
    "courier_partner": "URBANE_BOLT"
}'
```

### Request to place the bulk shipments for the orders

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

Create shipment request

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
