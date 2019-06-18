import React, { Component } from "react";
import {
  Map,
  TileLayer,
  ZoomControl,
  Marker,
  Popup,
  GeoJSON
} from "react-leaflet";
import DrawTools from "./DrawTools.js";

class UserMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ownLat: null,
      ownLng: null,
      mapUrl: "https://tiles.kartat.kapsi.fi/taustakartta/{z}/{x}/{y}.jpg",
      geoJSONFeatures: [],
      geoJSONLayer: {
        type: "FeatureCollection",
        features: []
      }
    };

    this.addToGeojsonLayer = this.addToGeojsonLayer.bind(this);
    this.setCurrentPosition = this.setCurrentPosition.bind(this);
    this.watchPositionId = null;
  }

  componentDidMount() {
    this.getCurrentPosition(position => {
      //this.setCurrentPosition(position);
    });
    //sendGeoJSON()
  }
  // Sends the players marker to the backend
  sendGeoJSON() {
    fetch("http://localhost:5000/mapmarkers/insertLocation", {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: this.state.geojsonLayer
    })
      .then(res => res.json())
      .then(result => console.log(result));
  }

  componentWillUnmount() {
    if (this.watchPositionId != null) {
      navigator.geolocation.clearWatch(this.watchPositionId);
    }
  }

  setCurrentPosition(data) {
    this.setState({
      ...this.state,
      geojsonLayer: data
    });
    console.log(
      "User mapin statessa oleva geojson: " +
        JSON.stringify(this.state.geoJSONLayer)
    );
  }

  getCurrentPosition(callback) {
    if (!navigator.geolocation) {
      console.log("Can't get geolocation :/");
    } else {
      // Position tracking options
      const options = {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 0
      };

      if (this.watchPositionId != null) {
        navigator.geolocation.clearWatch(this.watchPositionId);
      }

      this.watchPositionId = navigator.geolocation.watchPosition(
        position => {
          //success
          if (position != null) {
            callback(position);
          }
        },
        error => {
          console.log(error);
          // disable tracking
          if (this.watchPositionId != null) {
            navigator.geolocation.clearWatch(this.watchPositionId);
          }
        },
        options
      );
    }
  }

  addToGeojsonLayer(layerToAdd) {
    let oldFeatures = [...this.state.geoJSONFeatures];
    console.log(oldFeatures);
    oldFeatures.push(layerToAdd);
    const newFeatures = oldFeatures;
    this.setState({ geoJSONlayer: { features: newFeatures } });
    console.log(
      "Geojsonlayer state: " + JSON.stringify(this.state.geoJSONlayer)
    );
  }

  render() {
    return (
      <Map
        className="map"
        center={this.props.position}
        zoom={this.props.zoom}
        minZoom="7"
        maxZoom="17"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.maanmittauslaitos.fi/">Maanmittauslaitos</a>'
          url={this.props.mapUrl}
        />
        <ZoomControl position="topright" />
        <DrawTools
          position={this.props.position}
          addToGeojsonLayer={this.addToGeojsonLayer}
        />
        <Marker position={this.props.position}>
          <Popup>
            Se on perjantai, my dudes <br />
          </Popup>
        </Marker>
        {this.state.ownLat !== null && (
          <Marker position={[this.state.ownLat, this.state.ownLng]}>
            <Popup>
              User's real position.
              <br />
            </Popup>
          </Marker>
        )}
        <GeoJSON data={this.state.geoJSONlayer} />
      </Map>
    ); // this.state.geojsonLayer
  }
}

export default UserMap;
