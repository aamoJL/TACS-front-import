import React, { Component } from "react";
import { EditControl } from "react-leaflet-draw";
import { FeatureGroup } from "react-leaflet";

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

  render() {
    return (
      // "It's important to wrap EditControl component into FeatureGroup component from react-leaflet. The elements you draw will be added to this FeatureGroup layer, when you hit edit button only items in this layer will be edited."
      <FeatureGroup>
        <EditControl
          position="topright"
          onCreated={this._onCreated}
          draw={{
            circle: {
              repeatMode: true, // allows using the tool again after finishing the previous shape
              shapeOptions: {
                color: "#f9f10c",
                opacity: 100
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
                opacity: 100
              }
            },
            polyline: {
              repeatMode: true,
              shapeOptions: {
                color: "#ed2572",
                opacity: 100
              }
            },
            marker: {
              repeatMode: true
            },
            circlemarker: false
          }}
        />
      </FeatureGroup>
    );
  }
}

export default DrawTools;
