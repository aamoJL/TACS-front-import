import "./css/bootstrap.css";
import React from "react";
import ReactDOM from "react-dom";

import "leaflet/dist/leaflet.css";
import L from "leaflet";

import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

// make the default marker work with react (dunno if this is a weird hack)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
