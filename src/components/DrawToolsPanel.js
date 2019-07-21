import React, { Component } from "react";
import { EditControl } from "react-leaflet-draw";
import L from "leaflet";
import "leaflet-draw";
import {
  RegularFlagboxSVG,
  CapturingFlagboxSVG,
  PlayerInfantrySVG,
  PlayerReconSVG,
  PlayerMechanizedSVG
} from "./CreateSVG";

// an empty icon for textboxes
export const noIcon = L.divIcon({
  className: "",
  iconSize: [20, 20],
  iconAnchor: [10, 20]
});

// flagbox icon
export const flagboxIcon = (ownerColour, capturing) => {
  return L.divIcon({
    html: L.Util.template(CreateFlagboxSvg(ownerColour, capturing)),
    className: capturing === 2 ? "capturing-flagbox" : "captured-flagbox",
    iconSize: [75, 75],
    iconAnchor: [42, 75],
    popupAnchor: [-3, -76]
  });
};

export const playerIcon = (type, colour) => {
  return L.divIcon({
    html: L.Util.template(CreatePlayerSVG(type, colour)),
    className: "player-marker",
    iconSize: [10, 10],
    iconAnchor: [30, 40],
    popupAnchor: [0, -75]
  });
};

// functions that fetch correct svg data for Icon
// all svg data is in SVG-data.js
const CreateFlagboxSvg = (ownerColour, status) => {
  return status === 2
    ? CapturingFlagboxSVG(ownerColour)
    : RegularFlagboxSVG(ownerColour);
};
const CreatePlayerSVG = (icon, colour) => {
  return {
    "infantry.svg": PlayerInfantrySVG,
    "recon.svg": PlayerReconSVG,
    "mechanized.svg": PlayerMechanizedSVG
  }[icon](colour);
};
// class for text field
L.Draw.MarkerTextBox = L.Draw.Marker.extend({
  options: {
    icon: noIcon,
    repeatMode: false,
    interactive: true
  },
  initialize: function(map, options) {
    this.type = "textbox"; // important to have a unique type, so that it won't get mixed up with other elements
    this.featureTypeCode = "textbox";
    L.Draw.Feature.prototype.initialize.call(this, map, options);
  }
});

// Overriding default toolbar
// Just adding one new button though lol
L.DrawToolbar.include({
  getModeHandlers: function(map) {
    return [
      {
        enabled: this.options.polyline,
        handler: new L.Draw.Polyline(map, this.options.polyline),
        title: L.drawLocal.draw.toolbar.buttons.polyline
      },
      {
        enabled: this.options.polygon,
        handler: new L.Draw.Polygon(map, this.options.polygon),
        title: L.drawLocal.draw.toolbar.buttons.polygon
      },
      {
        enabled: this.options.rectangle,
        handler: new L.Draw.Rectangle(map, this.options.rectangle),
        title: L.drawLocal.draw.toolbar.buttons.rectangle
      },
      {
        enabled: this.options.circle,
        handler: new L.Draw.Circle(map, this.options.circle),
        title: L.drawLocal.draw.toolbar.buttons.circle
      },
      {
        enabled: this.options.marker,
        handler: new L.Draw.Marker(map, this.options.marker),
        title: L.drawLocal.draw.toolbar.buttons.marker
      },
      {
        enabled: this.options.marker,
        handler: new L.Draw.MarkerTextBox(map, this.options.marker),
        title: "Write text"
      }
    ];
  }
});

class DrawToolsPanel extends Component {
  render() {
    return (
      <EditControl
        onCreated={this.props.onCreated}
        onEdited={this.props.onEdited}
        onDeleted={this.props.onDeleted}
        onEditStart={this.props.onEditDeleteStart}
        onDeleteStart={this.props.onEditDeleteStart}
        onEditStop={this.props.onEditDeleteStop}
        onDeleteStop={this.props.onEditDeleteStop}
      />
    );
  }
}

export default DrawToolsPanel;
