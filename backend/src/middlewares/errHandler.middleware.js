import config from "../config/config.js";


const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  console.log(err)

  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
    errorCode : err.errorCode,
    ...(config.NODE_ENV === "development" && {
      stack: err.stack,
    }),
  });

};

export default errorHandler