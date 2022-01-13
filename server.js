const express = require("express");
const setUpDB = require("./config/dataBase");
const cors = require("cors");
const bodyParser = require("body-parser");
const router = require("./config/router");
const app = express();

const port = 9999;

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
setUpDB();
app.use("/", router);

app.listen(port, () => {
  console.log("listening on the port", port);
});
