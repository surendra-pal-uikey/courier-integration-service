import axios from "axios";
import { Mutex } from "async-mutex";
import { redisPublisher } from "../config/redis.js";

const CORIER_BASE_URL = process.env.COURER_BASE_URL;

const courierClient = axios.create({
  baseURL: CORIER_BASE_URL,
});

const mutex = new Mutex();

// Outbound Request Interceptor
courierClient.interceptors.request.use(async (config) => {
  let token = await redisPublisher.get(process.env.REDIS_ACCESS_KEY_FOR_TOKEN);

  const release = await mutex.acquire();
  try {
    if (!token) {
      // Token is missing or expired, fetch a new one
      const response = await axios.post(
        `${CORIER_BASE_URL}/auth/getToken/`,
        {
          username: process.env.CORIER_USERNAME,
          password: process.env.COURIER_PASSWORD,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      token = response.data.access_token;
      const expiresIn = response.data.expires_in;

      await redisPublisher.set(process.env.REDIS_ACCESS_KEY_FOR_TOKEN, token, {
        EX: expiresIn,
      });
    }
  } finally {
    release();
  }

  console.log("token", token);
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const createManifest = async (manifestData) => {
  try {
    const response = await urbaneBoltClient.post(
      "/services/manifest/",
      manifestData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error creating manifest:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const trackShipment = async (awb) => {
  try {
    const response = await urbaneBoltClient.get(
      `/services/tracking-pub/?awb=${awb}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error tracking shipment:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const cancelShipment = async (cancelData) => {
  try {
    const response = await urbaneBoltClient.post(
      "/services/cancel/",
      cancelData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error canceling shipment:",
      error.response?.data || error.message
    );
    throw error;
  }
};
