const errorHandlerMiddleware = (err, req, res, next) => {
  console.error(`[ERROR] ${err.stack}`);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Wystąpił błąd wewnętrzny serwera";

  res.status(statusCode).json({
    status: "error",
    message: message,
  });
};

const notFoundMiddleware = (req, res) => {
  res.status(404).json({
    status: "error",
    message: "Nie znaleziono",
  });
};

module.exports = {
  errorHandlerMiddleware,
  notFoundMiddleware,
};
