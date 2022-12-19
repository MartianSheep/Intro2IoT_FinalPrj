import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import axios from "axios";

const baseUrl = "https://iot-term-project-server.onrender.com";

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/messages", async (req, res) => {
  const response = await axios.post(
    "https://iot-term-project-server.onrender.com/messages",
    req.body
  );
  console.log(response.status);
  return res.status(200).send();
});

app.listen(5000, () =>
  console.log(`Server Running on Port: http://localhost:${5000}`)
);
// const res = await axios.get(
//   "https://iot-term-project-server.onrender.com/messages"
// );
// console.log(res.data);
