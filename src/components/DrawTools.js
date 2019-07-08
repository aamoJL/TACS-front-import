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

// an empty icon for textboxes
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
            '<div placeholder="Click out to save" contenteditable="true" id ="' +
              e.layer._leaflet_id +
              "><br></div>" ||
          tooltip.innerHTML ===
            '<div placeholder="Click out to save" contenteditable="true" id ="' +
              e.layer._leaflet_id +
              "><div><br></div></div>"
        ) {
          tooltip.innerHTML =
            '<div placeholder="Click out to save" contenteditable="true" id ="' +
            e.layer._leaflet_id +
            "></div>";
        }
      });

      // blur event listener can't be given straight to a layer
      // getting element by ID and adding an event listener to the element
      document
        .getElementById(e.layer._leaflet_id)
        .addEventListener(
          "blur",
          this.makeGeoJSON.bind(this, e.layerType, e.layer)
        ); // can't put this.makeGeoJSON(e) straight, as it calls the function
      document.getElementById(e.layer._leaflet_id).focus();

      console.log(e.layer);

      return; // only sending the textbox to database until text has been written
    } // end if (e.layerType === "textbox")

    this.makeGeoJSON(e.layerType, e.layer);
  }; // end _onCreated

  // turn layer to GeoJSON data
  makeGeoJSON = (layerType, layer) => {
    // setting the format in which the data will be sent
    let geoJSON = {
      data: layer.toGeoJSON(),
      mapDrawingId: layer.options.id
    };

    // setting properties
    if (layerType === "textbox") {
      if (layer._tooltip._content.innerText) {
        geoJSON.data.properties.text = layer._tooltip._content.innerText;
      } else {
        return;
      }
    } else if (layerType === "circle") {
      geoJSON.data.properties.radius = layer._mRadius; // layer.options.radius doesn't update for some reason; need to use _mRadius instead
    } else if (layerType === "rectangle") {
      // rectangle is a simple true/false property to recognize a rectangle
      // so that Polygons with this property can be inserted into map with rectangle functionalities instead of Polygon's
      geoJSON.data.properties.rectangle = true;
    }
    geoJSON.data.properties.color = layer.options.color;

    // send item to database, and receive an ID for the layer
    this.props.sendGeoJSON(geoJSON, false);
  };

  _onEditDeleteStart = () => {
    this.setState({ editModeActive: true });
  };

  _onEditDeleteStop = () => {
    this.setState({ editModeActive: false });
  };

  _onEdited = e => {
    // layers are saved in a rather curious format. they're not in an array, so need to make an array first
    let editedLayers = e.layers;
    let idsToEdit = [];
    editedLayers.eachLayer(function(layer) {
      idsToEdit.push(layer);
    });

    idsToEdit.map(layer => {
      // checking the contents of the layer to determine its type, as it's not explicitly stated
      if (layer.options.bounds) {
        this.makeGeoJSON("rectangle", layer);
      } else if (layer.options.radius) {
        this.makeGeoJSON("circle", layer);
      } else if (layer.options.text) {
        this.makeGeoJSON("textbox", layer);
      } else {
        this.makeGeoJSON(null, layer);
      }
    });
  };

  _onDeleted = e => {
    // layers are saved in a rather curious format. they're not in an array, so need to make an array first
    let deletedLayers = e.layers;
    let idsToDelete = [];
    deletedLayers.eachLayer(function(layer) {
      idsToDelete.push(layer);
    });

    idsToDelete.map(layer => {
      let geoJSON = {
        data: layer.toGeoJSON(),
        mapDrawingId: layer.options.id
      };

      this.props.sendGeoJSON(geoJSON, true);
    });
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
          onEdited={this._onEdited}
          onEditStart={this._onEditDeleteStart}
          onEditStop={this._onEditDeleteStop}
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
      </FeatureGroup>
    );
  }
}

export default DrawTools;
