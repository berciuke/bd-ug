const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");

require("dotenv").config({ path: path.join(__dirname, "../.env") });
require("../config/db"); 
const { connectMongo } = require(path.join(__dirname, '../config/mongo'));
connectMongo();

const app = express();
const port = process.env.API_PORT || 9999;
const productsRouter = require("./routes/productRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const userRouter = require("./routes/userRoutes");
const { errorHandlerMiddleware, notFoundMiddleware } = require("./middleware/errorHandlingMiddleware");

app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());

app.use("/products", productsRouter);
app.use("/reviews", reviewRouter);
app.use("/users", userRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
