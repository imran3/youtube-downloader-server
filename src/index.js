const express = require("express");
const cors = require("cors");
const ytdl = require("ytdl-core");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const app = express();
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(5000, () => {
  console.log("Server running at http://localhost:5000");
});

app.get("/", (req, res) => {
  console.log("Requested root");
  var msg = "hello there";
  res.json({ status: 200, msg: msg });
});

app.get("/download", (req, res) => {
  console.log("/download requeted");

  var URL = req.query.URL;
  res.json({ url: URL });
});
