const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");

require("dotenv").config({ path: path.join(__dirname, ".env") });

const app = express();
const port = process.env.PORT || 8081;
const productsRouter = require("./routes/productRoutes");
const {
  errorHandlerMiddleware,
  notFoundMiddleware,
} = require("./middleware/errorHandlingMiddleware");

app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());

app.use("/products", productsRouter);

app.use(notFoundMiddleware);

app.use(errorHandlerMiddleware);

const server = app.listen(port, function () {
  const host = server.address().address;
  console.log(`Server is listening at http://${host}:${port}`);
});