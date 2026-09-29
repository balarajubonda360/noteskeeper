/** Forward an unknown route to the central error handler as a 404. */
export const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

/** Convert common database and authentication errors to API responses. */
export const errorHandler = (error, req, res, next) => {
  let statusCode = error.statusCode || error.status || 500;
  let message = error.message || "Internal server error";

  if (error.name === "ValidationError" || error.name === "CastError") {
    statusCode = 400;
  } else if (error.code === 11000) {
    statusCode = 409;
    const duplicateField = Object.keys(error.keyValue || {})[0];
    message = duplicateField
      ? `${duplicateField} already exists`
      : "A record with this value already exists";
  } else if (
    error.name === "JsonWebTokenError" ||
    error.name === "TokenExpiredError"
  ) {
    statusCode = 401;
  }

  if (statusCode < 400 || statusCode > 599) statusCode = 500;

  const response = {
    success: false,
    message: statusCode === 500 && process.env.NODE_ENV === "production"
      ? "Internal server error"
      : message,
    data: null,
  };

  if (process.env.NODE_ENV !== "production") {
    response.stack = error.stack;
  }

  res.status(statusCode).json(response);
};
