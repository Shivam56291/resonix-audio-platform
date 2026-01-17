import { ErrorRequestHandler } from "express";
import mongoose from "mongoose";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err);

  let status = 500;
  let message = "Internal Server Error";

  // Mongoose validation error
  if (err instanceof mongoose.Error.ValidationError) {
    status = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  // Duplicate key error
  else if (err.code === 11000) {
    status = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists`;
  }

  // Explicit status (if you set err.status manually)
  else if (err.status) {
    status = err.status;
    message = err.message;
  }

  res.status(status).json({ error: message });
};
