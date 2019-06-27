import React, { Component } from "react";
import { EditControl } from "react-leaflet-draw";
import { FeatureGroup, Marker, Polygon, Polyline } from "react-leaflet";

class DrawTools extends Component {
  constructor(props) {
    super(props);
    this.state = {
      geoJSONAll: [], // property for all GeoJSON data in the map
      editModeActive: false
    };
  }

  _onCreated = e => {
    let type = e.layerType; // from the example; isn't used right now, but may be relevant in the future
    let layer = e.layer;
    this.makeGeoJSON(e.layer);
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

  _onEditStart = () => {
    this.setState({ editModeActive: true });
  };

  _onEditStop = () => {
    this.setState({ editModeActive: false });
  };

  shouldComponentUpdate() {
    // disable re-rendering when edit mode is active
    return !this.state.editModeActive;
  }

  // turn layer to GeoJSON data and add it to an array of all GeoJSON data of the current map
  makeGeoJSON = e => {
    let geoJSON = e.toGeoJSON();
    console.log(
      "UserMapille lähetettävä layeri: " + JSON.stringify(geoJSON, null, 4)
    ); // printing GeoJSON data of the previous object create
    this.props.sendGeoJSON(geoJSON);
  };

  addFetchedLayerToMap = (id, feature) => {
    if (feature.geometry.type === "Point") {
      // GeoJSON saves latitude first, not longitude like usual. swapping
      let position = [
        feature.geometry.coordinates[1],
        feature.geometry.coordinates[0]
      ];
      // keys are required to be able to edit
      return <Marker key={Math.random()} position={position} id={id} />;
    } else if (feature.geometry.type === "Polygon") {
      // polygons have, for some reason, an extra single element array above other arrays. no other objects have this
      let coords = feature.geometry.coordinates[0];
      let positions = coords.map(item => {
        return [item[1], item[0]];
      });
      return <Polygon key={Math.random()} positions={positions} id={id} />;
    } else if (feature.geometry.type === "LineString") {
      let coords = feature.geometry.coordinates;
      let positions = coords.map(item => {
        return [item[1], item[0]];
      });
      return <Polyline key={Math.random()} positions={positions} id={id} />;
    }
  };

  render() {
    return (
      // "It's important to wrap EditControl component into FeatureGroup component from react-leaflet.
      // The elements you draw will be added to this FeatureGroup layer,
      // when you hit edit button only items in this layer will be edited."
      <FeatureGroup>
        <EditControl
          position="topright"
          onCreated={this._onCreated}
          onDrawStop={this._onDrawStop}
          onEditStart={this._onEditStart}
          onEditStop={this._onEditStop}
          onEditMove={this._onEditMove}
          onEditResize={this._onEditResize}
          onEditVertex={this._onEditVertex}
          draw={{
            circle: {
              repeatMode: true, // allows using the tool again after finishing the previous shape
              shapeOptions: {
                color: "#f9f10c",
                opacity: 1
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
              repeatMode: true
            },
            circlemarker: false
          }}
          edit={{
            marker: true
          }}
        />

        {/* iterate through every element fetched from back-end */}
        {this.props.geoJSONLayer.features.map((feature, arrayIndex) => {
          // first element in geoJSONLayer has an extra one element array for some reason
          if (arrayIndex === 0) {
            return this.addFetchedLayerToMap(feature[0], feature[1][0]);
          } else {
            return this.addFetchedLayerToMap(feature[0], feature[1]);
          }
        })}
      </FeatureGroup>
    );
  }
}

export default DrawTools;
