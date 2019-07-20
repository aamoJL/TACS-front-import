import React from "react";
import L from "leaflet";
import {
  Circle,
  Marker,
  Polygon,
  Polyline,
  Rectangle,
  Tooltip
} from "react-leaflet";

// an empty icon for textboxes
let noIcon = L.divIcon({
  className: "",
  iconSize: [20, 20],
  iconAnchor: [10, 20]
});

class DrawLeafletObjects extends React.Component {
  createPolyline = drawing => {
    return (
      <Polyline
        key={Math.random()}
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
        key={Math.random()}
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
        key={Math.random()}
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
        key={Math.random()}
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
        key={Math.random()}
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
        key={Math.random()}
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
            textbox: this.createTextbox
          }[drawing.data.type](drawing);
        })}
      </React.Fragment>
    );
  }
}

export default DrawLeafletObjects;
