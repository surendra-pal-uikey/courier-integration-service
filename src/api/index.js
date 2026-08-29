import axios from "axios";
import { redisClient } from "../config/redis.js";

const urbaneBoltClient = axios.create({
  baseURL: "https://uat.urbanebolt.in/api/v1",
});

// Outbound Request Interceptor
urbaneBoltClient.interceptors.request.use(async (config) => {
  let token = await redisClient.get("tokens:urbane_bolt");

  if (!token) {
    // Token is missing or expired, fetch a new one
    const response = await axios.post(
      "https://uat.urbanebolt.in/api/v1/auth/getToken/",
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

    await redisClient.set("tokens:urbane_bolt", token, {
      EX: expiresIn,
    });
  }

  config.headers.Authorization = `Bearer ${token}`;
  return config;
});
