import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = process.env.PORT | 5000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.post("/record", (req, res) => {
  const ip = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "")
    .split(",")[0]
    .trim();
  console.log(`Receiving a record from ${ip}`);
  console.log(req.body);
  console.log(req.params);
  console.log(req.query);

  return res.status(200).send("received!!!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
