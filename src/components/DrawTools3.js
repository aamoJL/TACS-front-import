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
  Rectangle
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
    this.textBoxRef = React.createRef();
    this.state = {
      allLayers: [],
      editModeActive: false,
      deleteModeActive: false,
      geoJSONLayer: null,
      currentText: null,
      createdTextBox: null,
      layerAmount: null,
      createdMarker: null
    };
  }

  _onCreated = e => {
    console.log(e);
    // check if a drawn polyline has just one point in it
    if (e.layerType === "polyline" && e.layer.getLatLngs().length === 1) {
      e.layer.remove();
      return;
    }

    if (e.layerType === "textbox") {
      /*
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
      e.layer.on("mouseover", this.props.changeDragState);

      // enable dragging again when cursor is out of marker (tooltip)
      e.layer.on("mouseout", this.props.changeDragState);

      e.layer.on("click", this.checkDeleteModeStatus);

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

      // blur event listener can't be given straight to a layer for some reason
      // getting element by ID and adding an event listener to the element

      document.getElementById(
        e.layer._leaflet_id
      ).onblur = this.makeGeoJSON.bind(this, e.layerType, e.layer);

      document
        .getElementById(e.layer._leaflet_id)
        .addEventListener("focus", this._onEditStart);
      document.getElementById(e.layer._leaflet_id).focus();
      */

      this.createTextBox(e.layer, "");

      document.getElementById(e.layer._leaflet_id).focus();
      this.setState({
        createdTextBox: e.layer
      });
      return;
    } // end if (e.layerType === "textbox")

    if (e.layerType === "marker") {
      this.setState({
        createdMarker: e.layer
      });
      return;
    }

    this.addToAllLayers(e.layer);
    this.makeGeoJSON(e.layerType, e.layer);
    e.layer.remove();
  }; // end _onCreated

  // function to create textboxes
  // both on drawing and on fetching from database
  createTextBox(layer, text) {
    // have to create tooltip as a DOM element to allow text selecting. maybe
    let tooltip = L.DomUtil.create("div", "editable");

    // need ids for tooltips to be able to add a blur event to them
    tooltip.innerHTML =
      '<div contenteditable="true" placeholder="Click out to save" id="' +
      layer._leaflet_id +
      '">' +
      text +
      "</div>";

    layer.bindTooltip(tooltip, {
      permanent: true,
      direction: "bottom",
      interactive: true
    });

    // disable dragging when cursor is over marker (tooltip)
    // clicking on tooltip fires the marker's click handler, hence e.layer.on
    layer.on("mouseover", this.props.changeDragState.bind(this, false));

    // enable dragging again when cursor is out of marker (tooltip)
    layer.on("mouseout", this.props.changeDragState.bind(this, true));

    layer.on("click", this.checkDeleteModeStatus);

    // show placeholder text again upon emptying textbox
    layer.on("keyup", function() {
      // when the text area is emptied, a <br> appears
      // manually removing it so that the placeholder text can show
      if (
        tooltip.innerHTML ===
          '<div placeholder="Click out to save" contenteditable="true" id ="' +
            layer._leaflet_id +
            "><br></div>" ||
        tooltip.innerHTML ===
          '<div placeholder="Click out to save" contenteditable="true" id ="' +
            layer._leaflet_id +
            "><div><br></div></div>"
      ) {
        layer._tooltip._container.innerHTML =
          '<div placeholder="Click out to save" contenteditable="true" id ="' +
          layer._leaflet_id +
          "></div>";
      }
    });

    // option for determining if text has changed
    layer.options.oldText = text;

    // blur event listener can't be given straight to a layer for some reason
    // getting element by ID and adding an event listener to the element
    document.getElementById(
      layer._leaflet_id
    ).onblur = this.checkTextOnBlur.bind(this, layer);

    /*
    document.getElementById(
      layer._leaflet_id
    ).onblur = this.checkTextOnBlur.bind(this, layer);
    */

    // while textbox is on focus, it is being edited. however Leaflet's own edit mode is not on
    // need to determine manually that edit mode is on to avoid updating component, and hence losing focus from textbox every now and then
    document
      .getElementById(layer._leaflet_id)
      .addEventListener("focus", this._onEditStart);
  }

  // element is blurred when clicked on, for some reason.
  // check if text has changed, and if it has, only then send the element to the database
  checkTextOnBlur(layer) {
    let text = layer._tooltip._container.innerText;
    if (text !== layer.options.oldText) {
      layer.options.oldText = text;
      this.makeGeoJSON("textbox", layer);
    }
  }

  // turn layer to GeoJSON data
  makeGeoJSON = (layerType, layer) => {
    // in case the to-be-sent layer is a textbox, setting edit mode to false
    this.setState({
      editModeActive: false
    });

    // setting the format in which the data will be sent
    let geoJSON = {
      data: layer.toGeoJSON(),
      mapDrawingId: layer.options.id,
      drawingIsActive: true
    };

    // setting properties
    if (layerType === "textbox") {
      if (layer._tooltip._container.innerText) {
        geoJSON.data.properties.text = layer._tooltip._container.innerText;
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
    this.props.sendGeoJSON(geoJSON);
  };

  // fired by a click event on textbox. hovering on textbox text disables dragging on map.
  // deleting textbox fails to enable dragging, so a click event has been placed to check
  // if edit mode is active. if so, dragging is enabled
  checkDeleteModeStatus = () => {
    if (this.state.deleteModeActive === true) {
      this.props.changeDragState(true);
    }
  };

  _onEditStart = () => {
    this.setState({ editModeActive: true });
  };

  _onEditStop = () => {
    this.setState({ editModeActive: false });
  };

  _onDeleteStart = () => {
    this.setState({ deleteModeActive: true });
  };

  _onDeleteStop = () => {
    this.setState({ deleteModeActive: false });
  };

  // invoked when Save has been clicked in edit mode
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
      } else if (layer._tooltip) {
        this.makeGeoJSON("textbox", layer);
      } else {
        this.makeGeoJSON(null, layer);
      }
      return true;
    });
  };

  // invoked when Save or Clear all has been clicked in delete mode
  _onDeleted = e => {
    // layers are saved in a rather curious format. they're not in an array, so need to make an array first to be able to use map
    let deletedLayers = e.layers;
    let idsToDelete = [];
    deletedLayers.eachLayer(function(layer) {
      idsToDelete.push(layer);
    });

    // mapping the layer one by one to send to database
    idsToDelete.map(layer => {
      let geoJSON = {
        data: layer.toGeoJSON(),
        mapDrawingId: layer.options.id,
        drawingIsActive: false // the only difference on element deletion compared to editing is that drawingIsActive is set to false
      };

      this.props.sendGeoJSON(geoJSON);
      return true;
    });
  };

  shouldComponentUpdate(nextProps, nextState) {
    // disable re-rendering when edit mode is active
    if (
      this.state.editModeActive === true ||
      this.state.deleteModeActive === true
    ) {
      return false;
    }

    // don't render if the coming elements are same as the current elements
    // stops focus loss in elements, i.e. textbox
    if (nextProps.geoJSONLayer === this.props.geoJSONLayer) {
      return false;
    }

    return true;
  }

  addToAllLayers(layer) {
    /*
    let allLayersUpdate = this.state.allLayers;
    allLayersUpdate.push(layer);
    this.setState({
      allLayers: allLayersUpdate
    });
    console.log(this.state.allLayers);
    */
  }

  addToMap(feature) {
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
          <Circle
            key={Math.random()} // keys are required to be able to edit the elements
            center={position}
            id={id}
            radius={radius}
            color={color}
            onAdd={e => this.addToAllLayers(e.target)}
          />
        );
      } else if (text || text === "") {
        return (
          <Marker
            key={Math.random()}
            position={position}
            id={id}
            color={color}
            icon={noIcon}
            // onAdd={e => this.addToAllLayers(e.target)}
            onAdd={e => this.createTextBox(e.target, text)}
          />
        );
      } else {
        // unknown if color changes anything. need to test
        return (
          <Marker
            key={Math.random()}
            position={position}
            id={id}
            color={color}
            onAdd={e => this.addToAllLayers(e.target)}
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
          onAdd={e => this.addToAllLayers(e.target)}
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
          onAdd={e => this.addToAllLayers(e.target)}
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
          onAdd={e => this.addToAllLayers(e.target)}
        />
      );
    }
    return null;
  }
  /*

  checkDifferences() {
    let pos = 0;
    let prevLayers = this.state.allLayers;
    let nextLayers = this.props.geoJSONLayer.features;
    let stopPoint = prevLayers.length - 1;
    let layersToReturn = [];
    let something = null;

    for (let i = 0; i < nextLayers.length; i++) {
      console.log(pos + " asd");
      // check if there's more elements in the new layers than in previous layers
      if (pos > stopPoint) {
        layersToReturn.push(this.addToMap(nextLayers[pos]));
        pos++;
      } else if (
        prevLayers[pos].options.id ===
        nextLayers[nextLayers.length - 1].mapDrawingId
      ) {
      }

      // check if IDs mismatch, which means the element has been removed
      else if (prevLayers[pos].options.id !== nextLayers[pos].mapDrawingId) {
        console.log(prevLayers[pos].options.id);
        console.log(nextLayers[pos].mapDrawingId);
        console.log(pos);
        prevLayers.splice(pos, 1);
      }

      // check if element is a circle
      else if (
        prevLayers[pos]._mRadius &&
        nextLayers[pos].data.properties.radius
      ) {
        console.log("check if element is a circle start");
        something = this.checkCircleDifferences(
          prevLayers[pos],
          nextLayers[pos]
        );
        if (something !== null) {
          console.log("circle has changed");
          layersToReturn.push(something);
        }
        something = null;
        pos++;
      }

      // check if element is a rectangle
      else if (
        prevLayers[pos].options.id === nextLayers[pos].mapDrawingId &&
        nextLayers[pos].data.properties.rectangle
      ) {
        something = this.checkRectangleDifferences(
          prevLayers[pos],
          nextLayers[pos]
        );
        if (something !== null) {
          layersToReturn.push(something);
        }
        pos++;
      }

      // check if element is a textbox
      else if (
        prevLayers[pos]._tooltip &&
        nextLayers[pos].data.properties.text
      ) {
        something = this.checkTextBoxDifferences(
          prevLayers[pos],
          nextLayers[pos]
        );
        if (something !== null) {
          layersToReturn.push(something);
        }
        pos++;
      }

      // check if element is a marker
      else if (
        prevLayers[pos]._latlng &&
        nextLayers[pos].data.geometry.coordinates.length === 2
      ) {
        something = this.checkMarkerDifferences(
          prevLayers[pos],
          nextLayers[pos]
        );
        if (something !== null) {
          layersToReturn.push(something);
        }
        pos++;
      }

      // check if element is either a Polygon or a Polyline
      else if (prevLayers[pos]._latlngs) {
        something = this.checkPolyDifferences(prevLayers[pos], nextLayers[pos]);
        if (something !== null) {
          layersToReturn.push(something);
        }
        pos++;
      } else {
        console.log("something weird happened");
      }
    } // end for

    return layersToReturn;
  }

  checkCircleDifferences(prevLayer, nextLayer) {
    let id = nextLayer.mapDrawingId;
    let positions = [
      nextLayer.data.geometry.coordinates[1],
      nextLayer.data.geometry.coordinates[0]
    ];
    let color = nextLayer.data.properties.color;
    let radius = nextLayer.data.properties.radius;
    let status = false;
    if (
      prevLayer._mRadius !== nextLayer.data.properties.radius ||
      prevLayer._latlng.lat !== nextLayer.data.geometry.coordinates[1] ||
      prevLayer._latlng.lng !== nextLayer.data.geometry.coordinates[0]
    ) {
      status = true;
    }

    if (status === true) {
      return (
        <Circle
          key={Math.random()} // keys are required to be able to edit
          center={positions}
          id={id}
          radius={radius}
          color={color}
          onAdd={e => this.addToAllLayers(e.target)}
        />
      );
    } else {
      return null;
    }
  }

  checkRectangleDifferences(prevLayer, nextLayer) {
    let status = false;
    console.log("rectangle check");
  }

  checkTextBoxDifferences(prevLayer, nextLayer) {
    let status = false;
    console.log("textbox check");
  }

  checkMarkerDifferences(prevLayer, nextLayer) {
    let status = false;
    console.log("textbox check");
  }

  checkPolyDifferences(prevLayer, nextLayer) {
    let id = nextLayer.mapDrawingId;
    let color = nextLayer.data.properties.color;
    let positions;
    let status = null;
    if (nextLayer.data.geometry.type === "Polygon") {
      status = "Polygon";
      positions = nextLayer.data.geometry.coordinates[0].map(coord => {
        return [coord[1], coord[0]];
      });
    } else {
      status = "Polyline";
      positions = nextLayer.data.geometry.coordinates.map(coord => {
        return [coord[1], coord[0]];
      });
    }

    let coordsLength = prevLayer._latlngs[0].length;
    for (let i = 0; i < coordsLength - 1; i++) {
      if (
        prevLayer._latlngs[0][i].lat !==
          nextLayer.data.geometry.coordinates[0][i][1] ||
        prevLayer._latlngs[0][i].lng !==
          nextLayer.data.geometry.coordinates[0][i][0]
      ) {
        status = true;
        break;
      }
    }

    if (status === "Polygon") {
      return (
        <Polygon
          key={Math.random()}
          positions={positions}
          id={id}
          color={color}
          onAdd={e => this.addToAllLayers(e.target)}
        />
      );
    } else if (status === "Polyline") {
      return (
        <Polyline
          key={Math.random()}
          positions={positions}
          id={id}
          color={color}
          onAdd={e => this.addToAllLayers(e.target)}
        />
      );
    }
  }
  */

  render() {
    return (
      // "It's important to wrap EditControl component into FeatureGroup component from react-leaflet.
      // The elements you draw will be added to this FeatureGroup layer,
      // when you hit edit button only items in this layer will be edited."
      <FeatureGroup>
        {(this.props.role === "admin" ||
          this.props.role === "factionleader") && (
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
                repeatMode: false, // allows using the tool again after finishing the previous shape
                shapeOptions: {
                  color: "#f9f10c",
                  opacity: 1 // affects the outline only. for some reason it wasn't at full opacity, so this is needed for more clarity
                }
              },
              rectangle: {
                repeatMode: false
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
        )}

        {/* iterate through every element fetched from back-end */}
        {this.props.geoJSONLayer.features.map((feature, index) => {
          if (index === this.props.geoJSONLayer.features.length - 1) {
            if (
              this.state.createdTextBox !== null &&
              feature.data.properties.text
            ) {
              console.log(feature);
              let textbox = this.state.createdTextBox;
              textbox.options.id = feature.mapDrawingId;
              this.setState({
                createdTextBox: null
              });
              return;
            } else if (this.state.createdMarker !== null) {
              console.log(feature);
              let marker = this.state.createdMarker;
              marker.options.id = feature.mapDrawingId;
              this.setState({
                createdMarker: null
              });
              return;
            }
          }
          return this.addToMap(feature);
        })}

        {/* 
        {this.state.allLayers.length === 0
          ? this.props.geoJSONLayer.features.map(feature => {
              return this.addToMap(feature);
            })
          : this.checkDifferences().map(feature => {
              return feature;
            })}
            */}
      </FeatureGroup>
    );
  }
}

export default DrawTools;
