import React from "react";
import {
  Circle,
  Marker,
  Popup,
  Polygon,
  Polyline,
  Rectangle,
  Tooltip
} from "react-leaflet";
import { noIcon, flagboxIcon } from "./DrawToolsPanel";

class DrawLeafletObjects extends React.Component {
  createPolyline = drawing => {
    return (
      <Polyline
        key={drawing.mapDrawingId}
        positions={drawing.data.coordinates}
        id={drawing.mapDrawingId}
        type="polyline"
        //color={color}
      />
    );
  };

  createPolygon = drawing => {
    return (
      <Polygon
        key={drawing.mapDrawingId}
        positions={drawing.data.coordinates}
        id={drawing.mapDrawingId}
        type="polygon"
        //color={color}
      />
    );
  };

  createRectangle = drawing => {
    return (
      <Rectangle
        key={drawing.mapDrawingId}
        bounds={drawing.data.coordinates}
        id={drawing.mapDrawingId}
        type="rectangle"
        draggable={false}
        //color={color}
      />
    );
  };

  createCircle = drawing => {
    return (
      <Circle
        key={drawing.mapDrawingId}
        center={drawing.data.coordinates}
        id={drawing.mapDrawingId}
        radius={drawing.data.radius}
        type="circle"
        //color={color}
      />
    );
  };

  createMarker = drawing => {
    return (
      <Marker
        key={drawing.mapDrawingId}
        position={drawing.data.coordinates}
        id={drawing.mapDrawingId}
        type="marker"
        //color={color}
      />
    );
  };

  createTextbox = drawing => {
    return (
      <Marker
        key={drawing.mapDrawingId}
        position={drawing.data.coordinates}
        id={drawing.mapDrawingId}
        //color={color}
        icon={noIcon}
        type="textbox"
      >
        <Tooltip
          direction="bottom"
          permanent
          className="editable"
          interactive={true}
        >
          <div className="editable">
            <div contentEditable="true" placeholder="Click out to save">
              {drawing.data.text}
            </div>
          </div>
        </Tooltip>
      </Marker>
    );
  };

  // create a flagbox event
  // used in edit mode and when showing it on map
  // in edit mode the drawing does not have all information so return one with less info
  createFlagbox = drawing => {
    if (drawing.owner) {
      return (
        <Marker
          key={drawing.objectivePointId}
          position={drawing.data.coordinates}
          id={drawing.objectivePointId}
          icon={flagboxIcon(
            drawing.owner.colour,
            drawing.action.status,
            drawing.capture.colour
          )}
          type="flagbox"
          title={drawing.capture.colour}
        >
          <Popup>
            NodeId: {drawing.objectivePointDescription} <br />
            Value: {drawing.objectivePointMultiplier} <br />
            Owner: {drawing.owner.factionName} <br />
            Status: {drawing.action.message}
          </Popup>
        </Marker>
      );
    }
    return (
      <Marker
        key={drawing.objectivePointId}
        position={drawing.data.coordinates}
        id={drawing.objectivePointId}
        icon={flagboxIcon("#000000", 0, "#000000")}
        type="flagbox"
      >
        <Popup>
          NodeId: {drawing.objectivePointDescription} <br />
          Value: {drawing.objectivePointMultiplier} <br />
        </Popup>
      </Marker>
    );
  };

  render() {
    return (
      <React.Fragment>
        {this.props.drawings.map(drawing => {
          return {
            polyline: this.createPolyline,
            polygon: this.createPolygon,
            rectangle: this.createRectangle,
            circle: this.createCircle,
            marker: this.createMarker,
            textbox: this.createTextbox,
            flagbox: this.createFlagbox
          }[drawing.data.type](drawing);
        })}
      </React.Fragment>
    );
  }
}

export default DrawLeafletObjects;
