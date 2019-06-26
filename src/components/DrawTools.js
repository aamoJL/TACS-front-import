import React, { Component } from "react";
import { EditControl } from "react-leaflet-draw";
import {
  FeatureGroup,
  GeoJSON,
  Marker,
  Polygon,
  Polyline
} from "react-leaflet";
import L from "leaflet";

class DrawTools extends Component {
  constructor(props) {
    super(props);
    this.state = {
      geoJSONAll: [] // property for all GeoJSON data in the map
    };
  }

  _onCreated = e => {
    let type = e.layerType; // from the example; isn't used right now, but may be relevant in the future
    let layer = e.layer;
    this.makeGeoJSON(e.layer);
  };

  // turn layer to GeoJSON data and add it to an array of all GeoJSON data of the current map
  makeGeoJSON = e => {
    let geoJSON = e.toGeoJSON();
    //let newGeoJSONAll = this.state.geoJSONAll;
    //newGeoJSONAll.push(geoJSON);
    //this.setState({ geoJSONAll: newGeoJSONAll });
    console.log(
      "UserMapille lähetettävä layeri: " + JSON.stringify(geoJSON, null, 4)
    ); // printing GeoJSON data of the previous object create
    // console.log("newGeoJSONAll.length: " + newGeoJSONAll.length);
    this.props.addToGeojsonLayer(geoJSON);
  };

  // generate random UUID for React Leaflet component keys
  generateUUID() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return (
      s4() +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      s4() +
      s4()
    );
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
        {this.props.geoJSONLayer.features.map((ind, val) => {
          // first element is empty... for some reason.
          // should investigate further what is it
          if (val === 0) {
          } else if (ind.geometry.type === "Point") {
            // GeoJSON saves latitude first, not longitude like usual. swapping
            let position = [
              ind.geometry.coordinates[1],
              ind.geometry.coordinates[0]
            ];
            // keys are required to be able to edit
            return <Marker key={this.generateUUID()} position={position} />;
          } else if (ind.geometry.type === "Polygon") {
            // polygons have, for some reason, an extra single element array above other arrays. no other objects have this
            let coords = ind.geometry.coordinates[0];
            let positions = [];
            let position = [];
            for (let i = 0; i < coords.length; i++) {
              position = [coords[i][1], coords[i][0]];
              positions.push(position);
            }
            return <Polygon key={this.generateUUID()} positions={positions} />;
          } else if (ind.geometry.type === "LineString") {
            let coords = ind.geometry.coordinates;
            let positions = [];
            for (let i = 0; i < coords.length; i++) {
              positions.push([coords[i][1], coords[i][0]]);
            }
            return <Polyline key={this.generateUUID()} positions={positions} />;
          }
        })}
        {/*
        <Polygon
          key={this.generateUUID()}
          positions={[
            [62.25111, 25.804654],
            [62.249894, 25.814211],
            [62.24805, 25.811937],
            [62.247963, 25.806458]
          ]}
        />
        <Marker key={this.generateUUID()} position={[62.25111, 25.804654]} />
        */}
        {/*
        <GeoJSON
          key={JSON.stringify(this.props.geoJSONLayer)}
          data={this.props.geoJSONLayer}
        />*/}
      </FeatureGroup>
    );
  }
}

export default DrawTools;
