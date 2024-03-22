import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ChannelIdContextProvider } from "./Context/Context";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ChannelIdContextProvider>
      <App />
    </ChannelIdContextProvider>
  </React.StrictMode>
);
reportWebVitals();
