import React from "react";
import L from "leaflet";
import "leaflet-draw";
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

class DrawGeoJSON extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <React.Fragment>
        {/* iterate through every element fetched from back-end */}
        {this.props.geoJSONLayer.features.map(feature => {
          let id = feature.mapDrawingHistoryId;
          let coords = feature.data.geometry.coordinates;
          let type = feature.data.geometry.type;
          let color = feature.data.properties.color;
          let radius = feature.data.properties.radius;
          let text = feature.data.properties.text;
          let rectangle = feature.data.properties.rectangle;
          if (type === "Point") {
            // GeoJSON saves latitude first, not longitude like usual. swapping
            let position = [coords[1], coords[0]];
            if (radius) {
              return (
                // keys are required to be able to edit
                <Circle
                  key={Math.random()}
                  center={position}
                  id={id}
                  radius={radius}
                  color={color}
                />
              );
            } else if (text) {
              return (
                <Marker
                  key={Math.random()}
                  position={position}
                  id={id}
                  color={color}
                  icon={noIcon}
                >
                  <Tooltip
                    direction="bottom"
                    permanent
                    className="editable"
                    interactive={true}
                  >
                    <div class="editable">
                      <div
                        contenteditable="true"
                        placeholder="Click out to save"
                      >
                        {text}
                      </div>
                    </div>
                  </Tooltip>
                </Marker>
              );
            } else {
              // unknown if color changes anything. need to test
              return (
                <Marker
                  key={Math.random()}
                  position={position}
                  id={id}
                  color={color}
                />
              );
            }
          } else if (rectangle) {
            // instead of an array of four coordinates, rectangles only have two corners
            let bounds = coords[0].map(coord => {
              return [coord[1], coord[0]];
            });
            return (
              <Rectangle
                key={Math.random()}
                bounds={bounds}
                id={id}
                color={color}
              />
            );
          } else if (type === "Polygon") {
            // Polygon coordinates are wrapped under a one element array, for some reason
            let positions = coords[0].map(coord => {
              return [coord[1], coord[0]];
            });
            return (
              <Polygon
                key={Math.random()}
                positions={positions}
                id={id}
                color={color}
              />
            );
          } else if (type === "LineString") {
            // Polyline coordinates are a normal array, unlike Polygon
            let positions = coords.map(coord => {
              return [coord[1], coord[0]];
            });
            return (
              <Polyline
                key={Math.random()}
                positions={positions}
                id={id}
                color={color}
              />
            );
          }
        })}
      </React.Fragment>
    );
  }
}

export default DrawGeoJSON;
