import React from "react";
import ReactDOM from "react-dom/client";
import { AliveScope } from "react-activation";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AliveScope>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AliveScope>
);
