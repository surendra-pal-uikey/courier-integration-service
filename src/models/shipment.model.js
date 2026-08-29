// src/models/Order.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/database/mysql.js";
import { ShipmentStatus } from "../enums/shipments.enum.js";

export const Shipment = sequelize.define(
  "Shipment",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    courierPartnerUsed: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    courierShipmentId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    awbNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    currentShipmentStatus: {
      type: DataTypes.ENUM(...Object.values(ShipmentStatus)),
      defaultValue: ShipmentStatus.CREATED,
    },
  },
  {
    tableName: "shipments",
    timestamps: true,
  }
);
