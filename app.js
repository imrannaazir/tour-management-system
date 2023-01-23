const express = require("express");
const app = express();
const cors = require("cors");

//routes
const productRoute = require("./routers/product.route");

//middleware
app.use(express.json());
app.use(cors());



// routes
app.use("/api/v1/part", productRoute)

app.get("/", (req, res) => {
  res.send("Route is working! YaY!");
});


module.exports = app;
