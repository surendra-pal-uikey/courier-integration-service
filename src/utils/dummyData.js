export const getOriginAddress = () => {
  return {
    name: "Rohit Athaley",
    address:
      "HOLY FAITH INTERNATIONAL P LTD, Plot No.l37-138-139 Sector-I Spl.Industrial Area Govindpura",
    city: "Govindpura",
    state: "BHOPAL",
    country: "INDIA",
    pincode: 122001,
    mobile: 9425018023,
    email: "bhopal@mbdgroup.com",
    addressType: "Seller",
  };
};

export const getDestinationAddress = () => {
  return {
    name: "Satyam Convent School",
    address: "Plot No. 26-27, Om Nagar Society, Sumbhal, Surat (Deepak Sir)",
    city: "Surat",
    state: "GUJRAT",
    country: "INDIA",
    pincode: 122001,
    mobile: 8320226438,
    email: "TEST2@AIL.COM",
    addressType: "Home",
  };
};

export const getReturnAddress = () => {
  return {
    name: "Rohit Athaley",
    address:
      "HOLY FAITH INTERNATIONAL P LTD, Plot No.l37-138-139 Sector-I Spl.Industrial Area Govindpura",
    city: "Govindpura",
    state: "BHOPAL",
    country: "INDIA",
    pincode: 122017,
    mobile: 9425018023,
    email: "bhopal@mbdgroup.com",
    addressType: "Seller",
  };
};

export const getInvoiceDetails = () => {
  return {
    invoiceNumber: "INV0002",
    invoiceDate: "2024-10-02",
    invoiceValue: 10,
  };
};

export const getProductDetails = () => {
  return {
    description: "BOOKS",
    quantity: 1,
    pieces: 1,
    dimensions: {
      length: 12,
      breadth: 10,
      height: 10,
      weight: 1.1,
    },
  };
};

export const getOrderDetails = () => {
  return {
    serviceType: "SDD",
    payMode: "COD",
    declaredValue: 100,
    collectableValue: 1,
  };
};
