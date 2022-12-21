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

const port = 8000;
app.listen(port, () =>
  console.log(`Server Running on Port: http://localhost:${port}`)
);
// const res = await axios.get(
//   "https://iot-term-project-server.onrender.com/messages"
// );
// console.log(res.data);
