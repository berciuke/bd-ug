const express = require("express");
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8081
const productsRouter = require("./routes/productRoutes")

app.use(bodyParser.json());
app.use('/products', productsRouter);


const server = app.listen(port, function () {
  const host = server.address().address;
  console.log(`Server is listening at http://${host}:${port}`);
});
