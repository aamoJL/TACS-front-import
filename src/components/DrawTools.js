import React, { Component } from "react";
import { EditControl } from "react-leaflet-draw";
import L from "leaflet";
import "leaflet-draw";
import {
  FeatureGroup,
  Circle,
  Marker,
  Polygon,
  Polyline,
  Rectangle,
  Tooltip
} from "react-leaflet";

let noIcon = L.divIcon({
  className: "",
  iconSize: [20, 20],
  iconAnchor: [10, 20]
});

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

class DrawTools extends Component {
  constructor(props) {
    super(props);
    this.state = {
      geoJSONAll: [], // property for all GeoJSON data in the map
      editModeActive: false
    };
  }

  _onCreated = e => {
    console.log(e.layer);
    // check if a drawn polyline has just one point in it
    if (e.layerType === "polyline" && e.layer.getLatLngs().length === 1) {
      e.layer.remove();
      return;
    }

    if (e.layerType === "textbox") {
      // have to create tooltip as a DOM element to allow text selecting. maybe
      let tooltip = L.DomUtil.create("div", "editable");

      // need ids for tooltips to be able to add a blur event to them
      tooltip.innerHTML =
        '<div contenteditable="true" placeholder="Click out to save" id="' +
        e.layer._leaflet_id +
        '"></div>';

      e.layer.bindTooltip(tooltip, {
        permanent: true,
        direction: "bottom",
        interactive: true
      });

      // disable dragging when cursor is over marker (tooltip)
      // clicking on tooltip fires the marker's click handler, hence e.layer.on
      e.layer.on("mouseover", function() {
        e.layer._map.dragging.disable();
      });

      // enable dragging again when cursor is out of marker (tooltip)
      e.layer.on("mouseout", function() {
        e.layer._map.dragging.enable();
      });

      // show placeholder text again upon emptying textbox
      e.layer.on("keyup", function() {
        // when the text area is emptied, a <br> appears
        // manually removing it so that the placeholder text can show
        if (
          tooltip.innerHTML ===
            '<div placeholder="Click out to save" contenteditable="true"><br></div>' ||
          tooltip.innerHTML ===
            '<div placeholder="Click out to save" contenteditable="true"><div><br></div></div>'
        ) {
          tooltip.innerHTML =
            '<div placeholder="Click out to save" contenteditable="true"></div>';
        }
      });

      // blur event listener can't be given straight to a layer
      // getting element by ID and adding an event listener to the element
      document
        .getElementById(e.layer._leaflet_id)
        .addEventListener("blur", this.makeGeoJSON.bind(this, e)); // can't put this.makeGeoJSON(e) straight, as it calls the function
      document.getElementById(e.layer._leaflet_id).focus();

      console.log(e.layer);

      return;
    } // end if (e.layerType === "textbox")

    // turning layer data to GeoJSON
    this.makeGeoJSON(e);
  }; // end _onCreated

  // turn layer to GeoJSON data and add it to an array of all GeoJSON data of the current map
  makeGeoJSON = e => {
    let geoJSON = e.layer.toGeoJSON();

    if (e.layerType === "textbox") {
      if (e.layer._tooltip._content.innerText) {
        geoJSON.properties.text = e.layer._tooltip._content.innerText;
      } else {
        return;
      }
    } else if (e.layerType === "circle") {
      geoJSON.properties.radius = e.layer.options.radius;
    } else if (e.layerType === "rectangle") {
      geoJSON.properties.rectangle = true;
    }

    geoJSON.properties.color = e.layer.options.color;

    console.log(
      "UserMapille lähetettävä layeri: " + JSON.stringify(geoJSON, null, 4)
    ); // printing GeoJSON data of the previous object create
    e.layer.options.id = this.props.sendGeoJSON(geoJSON);
  };

  _onEditMove = e => {
    console.log("_onEditMove e:");
    console.log(e);
    // to be added once back-end has functionality to recognize ids
    // this.props.sendGeoJSON(e.layer);
  };

  _onEditResize = e => {
    console.log("_onEditResize e:");
    console.log(e);
  };

  _onEditVertex = e => {
    console.log("_onEditVertex e:");
    console.log(e);
    // to be added once back-end has functionality to recognize ids
    // this.props.sendGeoJSON(e.poly);
  };

  _onEditDeleteStart = () => {
    this.setState({ editModeActive: true });
  };

  _onEditDeleteStop = () => {
    this.setState({ editModeActive: false });
  };

  _onDeleted = e => {
    console.log(e.layers._layers);
    /* to be added once back-end functionality is available
    for(layer in e.layers._layers) {
      this.sendGeoJSON(layer.options.id);
    }
    */
  };

  shouldComponentUpdate() {
    // disable re-rendering when edit mode is active
    return !this.state.editModeActive;
  }

  render() {
    return (
      // "It's important to wrap EditControl component into FeatureGroup component from react-leaflet.
      // The elements you draw will be added to this FeatureGroup layer,
      // when you hit edit button only items in this layer will be edited."
      <FeatureGroup>
        <EditControl
          position="topright"
          onCreated={this._onCreated}
          onEditStart={this._onEditDeleteStart}
          onEditStop={this._onEditDeleteStop}
          onEditMove={this._onEditMove}
          onEditResize={this._onEditResize}
          onEditVertex={this._onEditVertex}
          onDeleted={this._onDeleted}
          onDeleteStart={this._onEditDeleteStart}
          onDeleteStop={this._onEditDeleteStop}
          draw={{
            circle: {
              repeatMode: true, // allows using the tool again after finishing the previous shape
              shapeOptions: {
                color: "#f9f10c",
                opacity: 1 // affects the outline only. for some reason it wasn't at full opacity, so this is needed for more clarity
              }
            },
            rectangle: {
              repeatMode: true
            },
            polygon: {
              repeatMode: true,
              allowIntersection: false, // Restricts shapes to simple polygons
              drawError: {
                color: "#e1e100", // Color the shape will turn when intersects
                message: "<strong>Oh snap!<strong> you can't draw that!" // Message that will show when intersect
              },
              shapeOptions: {
                color: "#ed2572",
                opacity: 1
              }
            },
            polyline: {
              repeatMode: true,
              shapeOptions: {
                color: "#ed2572",
                opacity: 1
              }
            },
            marker: {
              repeatMode: false
            },
            circlemarker: false
          }}
        />

        {/* iterate through every element fetched from back-end */}
        {this.props.geoJSONLayer.features.map(feature => {
          let id = feature.mapDrawingId;
          let coords = feature.data.geometry.coordinates;
          let type = feature.data.geometry.type;
          let color = feature.data.properties.color;
          let radius = feature.data.properties.radius;
          let text = feature.data.properties.text;
          // rectangle is a simple true/false property to recognize a rectangle
          // so that Polygons with this property can be inserted into map with rectangle functionalities
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
      </FeatureGroup>
    );
  }
}

export default DrawTools;
