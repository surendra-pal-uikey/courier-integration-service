import axios from "axios";
import { redis } from "../config/redis.js";

const URBANE_BOLT_BASE_URL =
  process.env.URBANE_URL || "https://uat.urbanebolt.in/api/v1";

const urbaneBoltClient = axios.create({
  baseURL: URBANE_BOLT_BASE_URL,
});

// Outbound Request Interceptor
urbaneBoltClient.interceptors.request.use(async (config) => {
  let token = await redis.get("tokens:urbane_bolt");

  if (!token) {
    // Token is missing or expired, fetch a new one
    const response = await axios.post(
      `${URBANE_BOLT_BASE_URL}/auth/getToken/`,
      {
        username: process.env.URBANE_BOLT_USERNAME,
        password: process.env.URBANE_PASSWORD,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Cookie:
            "csrftoken=SuZfjeJQJQNlDaNxRJgaMqylRWlqogsL; csrftoken=jMgIhiCS992MOB2mBgwf7tiF7pdezDG6; sessionid=pn4l30zoiqx9ybj9cjy7licfgko3wpen",
        },
      }
    );

    token = response.data.access_token;
    const expiresIn = response.data.expires_in;

    await redis.set("tokens:urbane_bolt", token, {
      EX: expiresIn,
    });
  }

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
          Cookie:
            "csrftoken=ryXzwTVfW5ClrjcU6lW2w22a9rCVeqUR; sessionid=21bjwngg0x9s90ujff1cq4dpls3ufc2t",
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
