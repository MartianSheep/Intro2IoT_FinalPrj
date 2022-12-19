import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bodyParser from "body-parser";

import cabinRoutes from "./routers/cabinRoutes.js";
import deviceRoutes from "./routers/deviceRoutes.js";
import messageRoutes from "./routers/messageRoutes.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

// 允許 Cross-Origin Resource Sharing
app.use(cors());

// 自動解析 body 的內容，如果是application/json形式就解析成JS的object
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/cabins", cabinRoutes);
app.use("/devices", deviceRoutes);
app.use("/messages", messageRoutes);

// Test Alive
app.get("/", (req, res) => {
  res.send("Site Alive!");
});

// app.post("/record", (req, res) => {
//   const ip = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "")
//     .split(",")[0]
//     .trim();
//   console.log(`Receiving a record from ${ip}`);
//   console.log(req.body);
//   console.log(req.params);
//   console.log(req.query);

//   return res.status(200).send("received!!!");
// });

mongoose
  .connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(port, () =>
      console.log(`Server Running on Port: http://localhost:${port}`)
    )
  )
  .catch((error) => console.log(error));
