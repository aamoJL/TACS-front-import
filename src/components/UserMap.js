import React, { Component } from "react";
import { Map, TileLayer, ZoomControl, Marker, Popup } from "react-leaflet";
import DrawTools from "./DrawTools.js";

class UserMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ownLat: null,
      ownLng: null,
      mapUrl: "https://tiles.kartat.kapsi.fi/taustakartta/{z}/{x}/{y}.jpg",
      geoJSONLayer: {
        type: "FeatureCollection",
        features: []
      }
    };

    this.sendGeoJSON = this.sendGeoJSON.bind(this);
    this.setCurrentPosition = this.setCurrentPosition.bind(this);
    this.watchPositionId = null;
  }

  componentDidMount() {
    this.getCurrentPosition(position => {
      this.setCurrentPosition(position);
    });
    this.fetchGeoJSON();
  }
  // Sends the players drawings to the backend (and database)
  sendGeoJSON(layerToDatabase) {
    fetch("http://localhost:5000/draw/mapdrawing/insert-location", {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      // need to add id once back-end is ready for it
      body: JSON.stringify({
        type: "FeatureCollection",
        features: layerToDatabase
      })
    });
  }
  // Get the drawings from the backend and add them to the state, so they can be drawn
  fetchGeoJSON() {
    fetch("http://localhost:5000/draw/mapdrawing/insert-location", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        let newFeatures = [];
        data.map(item => {
          newFeatures.push([item.id, item.features]);
        });

        this.setState({
          geoJSONLayer: {
            type: "FeatureCollection",
            features: [...newFeatures]
          }
        });
      });
  }

  componentWillUnmount() {
    if (this.watchPositionId != null) {
      navigator.geolocation.clearWatch(this.watchPositionId);
    }
  }

  setCurrentPosition(position) {
    this.setState({
      ownLat: position.coords.latitude,
      ownLng: position.coords.longitude
    });
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
          sendGeoJSON={this.sendGeoJSON}
          geoJSONLayer={this.state.geoJSONLayer}
        />
        {this.state.ownLat !== null && (
          <Marker position={[this.state.ownLat, this.state.ownLng]}>
            <Popup>
              User's real position.
              <br />
            </Popup>
          </Marker>
        )}
      </Map>
    );
  }
}
export default UserMap;
