import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  //<GlobalStateProvider>
  <App />
  //</GlobalStateProvider>
  , document.getElementById("root"));

serviceWorker.unregister();
