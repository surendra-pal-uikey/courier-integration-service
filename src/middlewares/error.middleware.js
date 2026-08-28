import { AppError } from "../errors/app.error.js";

export const errorHandler = (err, req, res, next) => {
  let statusCode = err instanceof AppError ? err.statusCode : 500;
  let message = err.message || "Internal Server Error";

  if (!err.isOperational) {
    console.error("CRITICAL UNHANDLED ERROR:", err);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message:
        process.env.NODE_ENV === "production" && !err.isOperational
          ? "Internal Server Error"
          : message,
    },
  });
};
