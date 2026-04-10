class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorMiddleware = (err, req, res, next) => {
  err.message = err.message || "Internal server error";
  err.statusCode = err.statusCode || 500;

  // ✅ Mongo duplicate error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    err = new ErrorHandler(message, 400);
  }

  // ✅ JWT errors
  if (err.name === "JsonWebTokenError") {
    err = new ErrorHandler("Invalid token, try again", 400);
  }

  if (err.name === "TokenExpiredError") {
    err = new ErrorHandler("Token expired, try again", 400);
  }

  // ❗ FIXED (err not arr)
  if (err.name === "CastError") {
    const message = "Resource not found. Invalid " + err.path;
    err = new ErrorHandler(message, 400);
  }

  const errorMessage = err.errors
    ? Object.values(err.errors)
        .map((value) => value.message)
        .join(", ")
    : err.message;

  // ✅ VERY IMPORTANT: ADD CORS HEADERS HERE
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Credentials", "true");

  return res.status(err.statusCode).json({
    success: false,
    message: errorMessage,
  });
};

export default ErrorHandler;