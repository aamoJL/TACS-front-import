import React, { Component } from "react";
import ReactDOM from "react-dom";
import { MapControl } from "react-leaflet";
import { ChromePicker } from "react-color";
import L from "leaflet";
import "leaflet-draw";

class ColorPicker extends MapControl {
  componentWillMount() {
    const colorPicker = L.control({ position: "topright" });
    const jsx = (
      <div class="leaflet-bar leaflet-control leaflet-control-custom" />
    );
    colorPicker.onAdd = function(map) {
      ReactDOM.render(jsx);
    };
  }
}

export default ColorPicker;
